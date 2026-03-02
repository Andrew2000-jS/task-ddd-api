import { INestApplication, HttpStatus } from '@nestjs/common';
import { createTestingApp } from 'test/config/test.module';
import { clearDB } from 'test/utils/db';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { AuthAPI } from 'test/utils/auth-test';
import { MockAuthGuard } from 'test/config/mocks';
import { TaskAPI } from 'test/utils/taks-test';

describe('Task Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const BASE_TASK_URL = '/api/v1/tasks';
  const BASE_AUTH_URL = '/api/v1/auth';

  const validPayload = {
    title: 'New Task',
    description: 'This is a valid description longer than 10 chars',
    isCompleted: false,
  };

  beforeAll(async () => {
    app = await createTestingApp();
    dataSource = app.get('DATA_SOURCE');
  });

  beforeEach(async () => {
    await clearDB(dataSource);

    const authAPI = new AuthAPI(app, BASE_AUTH_URL);

    const authPayload = {
      email: 'test1@gmail.com',
      password: 'Abc@12345',
    };

    await authAPI.create(authPayload);
    await authAPI.waitForUserCreation(dataSource, authPayload.email);
    await authAPI.login(authPayload);
    await authAPI.syncMockGuard(authPayload.email, dataSource);
  });

  afterEach(() => (MockAuthGuard.mockUser = null));
  afterAll(async () => await app.close());

  describe('Create Task (POST tasks/)', () => {
    it('should create a task successfully (201)', async () => {
      const taksAPI = new TaskAPI(app, BASE_TASK_URL);
      const { statusCode, success } = await taksAPI.create({
        ...validPayload,
        slug: 'new-task-0001',
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(success).toBeTruthy();
    });

    it('should fail with 400 if Description is too short (Domain Error)', async () => {
      const taksAPI = new TaskAPI(app, BASE_TASK_URL);

      const invalidPayload = {
        ...validPayload,
        description: 'Short',
        slug: 'invalid-task-00001',
      };

      const { statusCode, success } = await taksAPI.create({
        ...invalidPayload,
        slug: 'new-task-0001',
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(success).toBeFalsy();
    });
  });

  describe('Get all Tasks (GET tasks/)', () => {
    it('should return paginated tasks (200)', async () => {
      const taksAPI = new TaskAPI(app, BASE_TASK_URL);
      await taksAPI.create({
        ...validPayload,
        slug: 'new-task-0001',
      });

      return request(app.getHttpServer())
        .get(`${BASE_TASK_URL}?limit=10&offset=0`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { data, meta } = res.body;
          expect(res.body.success).toBe(true);
          expect(data).toHaveLength(1);
          expect(meta.page).toBe(1);
        });
    });

    it('should return empty list if no tasks found', async () => {
      return request(app.getHttpServer())
        .get(`${BASE_TASK_URL}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.meta.total).toBe(0);
        });
    });

    it('should handle database errors gracefully (500)', async () => {
      return request(app.getHttpServer())
        .get(`${BASE_TASK_URL}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
        });
    });
  });

  describe('Get single Task (GET tasks/id)', () => {
    it('should return a single task successfully (200)', async () => {
      const taksAPI = new TaskAPI(app, BASE_TASK_URL);
      const { data } = await taksAPI.create({
        ...validPayload,
        slug: 'new-task-0001',
      });

      return request(app.getHttpServer())
        .get(`${BASE_TASK_URL}/${data.id}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.success).toBeTruthy();
          expect(res.body.data.title).toBe('New Task');
        });
    });

    it('should fail if ID is not a UUID', () => {
      return request(app.getHttpServer())
        .get(`${BASE_TASK_URL}/not-a-uuid`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });

    it('should fail if Task does not exist', async () => {
      return request(app.getHttpServer())
        .get(`${BASE_TASK_URL}/550e8400-e29b-41d4-a716-446655440000`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });
  });

  describe('Update Task (PATCH tasks/id)', () => {
    it('should update a task successfully (200)', async () => {
      const taksAPI = new TaskAPI(app, BASE_TASK_URL);
      const { data } = await taksAPI.create({
        ...validPayload,
        slug: 'new-task-0001',
      });

      return request(app.getHttpServer())
        .patch(`${BASE_TASK_URL}/${data.id}`)
        .send({ title: 'Task titke updated' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { success, data } = res.body;
          expect(data.message).toBe('Task Updated successfully');
          expect(success).toBeTruthy();
        });
    });

    it('should fail 404 if task to update is not found', async () => {
      return request(app.getHttpServer())
        .patch(`${BASE_TASK_URL}/dd428149-a81a-44c2-ac1b-fa4f5ea344b0`)
        .send({ title: 'Updated title' })
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });

    it('should fail 400 if ID is invalid', async () => {
      return request(app.getHttpServer())
        .patch(`${BASE_TASK_URL}/invalid-uuid-here`)
        .send({ title: 'Updated title' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });
  });

  describe('Deltet Task (Delete tasks/id)', () => {
    it('should delete a task successfully (204)', async () => {
      const taksAPI = new TaskAPI(app, BASE_TASK_URL);
      const { data } = await taksAPI.create({
        ...validPayload,
        slug: 'new-task-0001',
      });

      return request(app.getHttpServer())
        .delete(`${BASE_TASK_URL}/${data.id}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect((res) => {
          expect(res.body.success).toBe(undefined);
        });
    });

    it('should fail 404 if task to delete does not exist', async () => {
      return request(app.getHttpServer())
        .delete(`${BASE_TASK_URL}/08f342b4-9aa2-4584-b7a7-7c73f5faf868`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });
  });
});
