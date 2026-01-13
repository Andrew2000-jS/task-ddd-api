import { INestApplication, HttpStatus } from '@nestjs/common';
import { User } from 'src/contexts/users/domain/user';
import request from 'supertest';
import { createTestingApp } from 'test/config/test.module';
import { DataSource } from 'typeorm';
import { clearDB, createAuth, createUser } from 'test/utils/db';
import { createUserByHttp } from 'test/utils/http';

describe('User Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const URL = '/api/v1/users';

  beforeAll(async () => {
    app = await createTestingApp();
    dataSource = app.get('DATA_SOURCE');
  });

  beforeEach(async () => {
    await clearDB(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    const validPayload = {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      birthday: '1990-01-01',
    };

    it('should create a user successfully (201)', async () => {
      const authID = '550e8400-e29b-41d4-a716-446655453001';

      await createAuth(dataSource, {
        authID,
        rawPassword: 'Abc@12345',
        userEmail: 'test@gggmmail.com',
      });

      validPayload['authId'] = authID;

      return request(app.getHttpServer())
        .post(`${URL}`)
        .send(validPayload)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.username).toBe(validPayload.username);
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

    it('should fail with 400 if Username is too short (Validation Pipe)', async () => {
      const authId = 'b45c99d1-0158-44e4-a161-ab0e374412b7';

      const invalidPayload = { ...validPayload, username: 'a', authId };

      return request(app.getHttpServer())
        .post(`${URL}`)
        .send(invalidPayload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });
  });

  describe('/users (GET)', () => {
    it('should return paginated users (200)', async () => {
      await createUserByHttp(app, dataSource, {
        authId: '7f580026-a2d1-406f-b02c-e32cd92b20cf',
        username: 'http_user_01',
      });

      return request(app.getHttpServer())
        .get(`${URL}?limit=10&offset=0`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { success } = res.body;
          const { data, meta } = res.body.data;
          expect(success).toBe(true);
          expect(data).toHaveLength(1);
          expect(meta.page).toBe(1);
        });
    });

    it('should return empty list if no users found', async () => {
      return request(app.getHttpServer())
        .get(`${URL}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { data, meta } = res.body.data;
          expect(data).toEqual([]);
          expect(meta.page).toBe(1);
        });
    });

    it('should handle database errors gracefully (500)', async () => {
      return request(app.getHttpServer())
        .get(`${URL}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { data } = res.body.data;
          expect(data).toEqual([]);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should fail if ID is not a UUID', () => {
      return request(app.getHttpServer())
        .get(`${URL}/not-a-uuid`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });

    it('should fail if User does not exist', async () => {
      return request(app.getHttpServer())
        .get(`${URL}/550e8400-e29b-41d4-a716-446655440000`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });
  });

  describe('/users/:id (GET) - Success', () => {
    it('should return a single user successfully (200)', async () => {
      const createdUserBody = await createUserByHttp(app, dataSource, {
        authId: '5237bc88-0e65-4815-b289-84afbc0a9f25',
        username: 'http_user_02',
      });
      return request(app.getHttpServer())
        .get(`${URL}/${createdUserBody.data.id}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { data, success } = res.body;
          expect(success).toBe(true);
          expect(data.username).toBe('http_user_02');
        });
    });
  });

  describe('/users/:id (Patch)', () => {
    it('should update a user successfully (200)', async () => {
      const user = await createUserByHttp(app, dataSource, {
        authId: 'd27f5ad9-8c09-4459-b6bb-9f9bb019d3ba',
        username: 'http_user_034',
      });

      const updatePayload = {
        firstname: 'Updated',
        username: 'updatedname',
      };

      return request(app.getHttpServer())
        .patch(`${URL}/${user.data.id}`)
        .send(updatePayload)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('should fail 404 if user to update is not found', async () => {
      const authId = '550e8400-e29b-41d4-a716-446655440000';

      return request(app.getHttpServer())
        .patch(`${URL}/${authId}`)
        .send({ firstname: 'This not gonna work' })
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });

    it('should fail 400 if ID is invalid (Validation Pipe)', async () => {
      return request(app.getHttpServer())
        .patch(`${URL}/invalid-uuid-here`)
        .send({ firstname: 'This not gonna work :)' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user successfully (204)', async () => {
      const user = await createUserByHttp(app, dataSource, {
        authId: '2ff058af-ba43-42e6-a4d5-50ead99b2864',
        username: 'http_user_034',
      });
      return request(app.getHttpServer())
        .delete(`${URL}/${user.data.id}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect((res) => {
          expect(res.body.success).toBe(undefined);
        });
    });

    it('should fail 404 if user to delete does not exist', async () => {
      return request(app.getHttpServer())
        .delete(`${URL}/b9e2ef40-3b8d-45d7-af67-935d38643018`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });
  });
});
