import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from 'test/config/test.module';
import { DataSource } from 'typeorm';
import { clearDB } from 'test/utils/db';
import { AuthAPI } from 'test/utils/auth-test';
import { MockAuthGuard } from 'test/config/mocks';

describe('User Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const BASE_USER_URL = '/api/v1/users';
  const BASE_AUTH_URL = '/api/v1/auth';

  beforeAll(async () => {
    app = await createTestingApp();
    dataSource = app.get('DATA_SOURCE');
  });

  beforeEach(async () => await clearDB(dataSource));
  afterEach(() => (MockAuthGuard.mockUser = null));
  afterAll(async () => await app.close());

  describe('User Update (PATCH /users)', () => {
    it('should update a user and also get the profile', async () => {
      const authAPI = new AuthAPI(app, BASE_AUTH_URL);

      const authPayload = {
        email: 'test5@gmail.com',
        password: 'Abc@12345',
      };

      await authAPI.create(authPayload);
      await authAPI.login(authPayload);
      await authAPI.syncMockGuard(authPayload.email, dataSource);

      await request(app.getHttpServer())
        .patch(BASE_USER_URL)
        .send({
          username: 'JhonDOOE222',
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { body, statusCode } = res;
          expect(body.success).toBeTruthy();
          expect(statusCode).toBe(200);
          expect(body.data.message).toBe('User Updated successfully');
        });

      return request(app.getHttpServer())
        .get(`${BASE_USER_URL}/profile`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { data, success } = res.body;
          expect(success).toBe(true);
          expect(data.username).toBe('JhonDOOE222');
        });
    });

    it('should fail with 400 if Username is too short (Validation Pipe)', async () => {
      const validPayload = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        birthday: '1990-01-01',
      };

      const authAPI = new AuthAPI(app, BASE_AUTH_URL);
      const authPayload = {
        email: 'test@gmail.com',
        password: 'Abc@12345',
      };

      await authAPI.create(authPayload);
      await authAPI.login(authPayload);
      await authAPI.syncMockGuard(authPayload.email, dataSource);

      const invalidPayload = {
        ...validPayload,
        username: 'a',
      };

      request(app.getHttpServer())
        .patch(BASE_USER_URL)
        .send(invalidPayload)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('HTTP_ERROR');
        });
    });
  });

  describe('User Delete (DELETE /users)', () => {
    it('should delete a user successfully (204)', async () => {
      const authAPI = new AuthAPI(app, BASE_AUTH_URL);

      const authPayload = {
        email: 'test00@gmail.com',
        password: 'Abc@12345',
      };

      await authAPI.create(authPayload);
      await authAPI.login(authPayload);
      await authAPI.syncMockGuard(authPayload.email, dataSource);

      return request(app.getHttpServer())
        .delete(BASE_USER_URL)
        .expect(HttpStatus.NO_CONTENT)
        .expect((res) => {
          expect(res.body.success).toBe(undefined);
        });
    });
  });
});
