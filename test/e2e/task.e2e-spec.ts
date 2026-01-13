import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from 'test/config/test.module';
import { clearDB, createAuth, createTask, createUser } from 'test/utils/db';
import { DataSource } from 'typeorm';

describe('Task Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const URL = '/api/v1/tasks';

  beforeAll(async () => {
    app = await createTestingApp();
    dataSource = app.get('DATA_SOURCE');
  });

  beforeEach(async () => {
    await clearDB(dataSource);

    await createAuth(dataSource, {
      authID: '550e8400-e29b-41d4-a716-416652443405',
      rawPassword: 'Abc@12345',
      userEmail: 'test@gggmmail.com',
    });

    await createUser(dataSource, {
      userID: '550e8400-e29b-41d4-a716-416652443405',
      authId: '550e8400-e29b-41d4-a716-416652443405',
      username: 'testuser_1',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (POST)', () => {
    const validPayload = {
      title: 'New Task',
      description: 'This is a valid description longer than 10 chars',
      isCompleted: false,
      userId: '550e8400-e29b-41d4-a716-416652443405',
    };

    it('should create a task successfully (201)', async () => {
      validPayload['slug'] = 'new-task-0001';
      return request(app.getHttpServer())
        .post(`${URL}`)
        .send(validPayload)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe(validPayload.title);
        });
    });

    it('should fail with 400 if Payload is empty (Validation Pipe)', async () => {
      return request(app.getHttpServer())
        .post(`${URL}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });

    it('should fail with 400 if Description is too short (Domain Error)', async () => {
      const invalidPayload = {
        ...validPayload,
        description: 'Short',
        slug: 'invalid-task-00001',
      };

      return request(app.getHttpServer())
        .post(`${URL}`)
        .send(invalidPayload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('BAD_REQUEST');
          expect(res.body.error.message).toMatch(/description/i);
        });
    });
  });

  describe('/tasks (GET)', () => {
    it('should return paginated tasks (200)', async () => {
      return request(app.getHttpServer())
        .get(`${URL}?limit=10&offset=0`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { data, meta } = res.body;
          expect(res.body.success).toBe(true);
          expect(data).toHaveLength(0);
          expect(meta.page).toBe(1);
        });
    });

    it('should return empty list if no tasks found', async () => {
      return request(app.getHttpServer())
        .get(`${URL}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.meta.total).toBe(0);
        });
    });

    it('should handle database errors gracefully (500)', async () => {
      return request(app.getHttpServer())
        .get(`${URL}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
        });
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should fail if ID is not a UUID', () => {
      return request(app.getHttpServer())
        .get(`${URL}/not-a-uuid`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });

    it('should fail if Task does not exist', async () => {
      return request(app.getHttpServer())
        .get(`${URL}/550e8400-e29b-41d4-a716-446655440000`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });
  });

  describe('/tasks/:id (GET) - Success', () => {
    const taskID = '550e8400-129b-41d4-af16-446655440000';

    it('should return a single task successfully (200)', async () => {
      await createTask(dataSource, {
        taskID,
        title: 'Existing Task',
        slug: 'existing-task',
        userId: '550e8400-e29b-41d4-a716-416652443405',
      });

      return request(app.getHttpServer())
        .get(`${URL}/${taskID}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(taskID);
          expect(res.body.data.title).toBe('Existing Task');
        });
    });
  });

  describe('/tasks/:id (Patch)', () => {
    const taskID = '550e8400-e29b-41d4-a716-446655440000';
    const updatePayload = {
      isCompleted: true,
      title: 'Updated Title',
    };

    it('should update a task successfully (200)', async () => {
      await createTask(dataSource, {
        taskID,
        title: 'Existing Task',
        slug: 'existing-task',
        userId: '550e8400-e29b-41d4-a716-416652443405',
      });

      return request(app.getHttpServer())
        .patch(`${URL}/${taskID}`)
        .send(updatePayload)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('should fail 404 if task to update is not found', async () => {
      return request(app.getHttpServer())
        .patch(`${URL}/${taskID}`)
        .send(updatePayload)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });

    it('should fail 400 if ID is invalid', async () => {
      return request(app.getHttpServer())
        .patch(`${URL}/invalid-uuid-here`)
        .send(updatePayload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    const taskId = '550e8400-e29b-41d4-a716-446655440000';

    it('should delete a task successfully (204)', async () => {
      await createTask(dataSource, {
        taskID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Existing Task',
        slug: 'existing-task',
        userId: '550e8400-e29b-41d4-a716-416652443405',
      });
      return request(app.getHttpServer())
        .delete(`${URL}/${taskId}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect((res) => {
          expect(res.body.success).toBe(undefined);
        });
    });

    it('should fail 404 if task to delete does not exist', async () => {
      return request(app.getHttpServer())
        .delete(`${URL}/${taskId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });
  });
});
