import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { clearDB } from 'test/utils/db';
import { createTestingApp } from 'test/config/test.module';
import { AuthAPI } from 'test/utils/auth-test';
import { MockAuthGuard } from 'test/config/mocks';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const BASE_URL = '/api/v1/auth';

  beforeAll(async () => {
    app = await createTestingApp();
    dataSource = app.get('DATA_SOURCE');
  });

  beforeEach(async () => clearDB(dataSource));
  afterEach(() => (MockAuthGuard.mockUser = null));
  afterAll(async () => await app.close());

  describe('Create Auth (POST auth/register)', () => {
    it('should register a new user successfully', async () => {
      const authAPI = new AuthAPI(app, BASE_URL);

      const payload = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const { statusCode, success } = await authAPI.create(payload);

      expect(success).toBe(true);
      expect(statusCode).toBe(HttpStatus.CREATED);
    });
  });

  describe('Auth Login (POST auth/login)', () => {
    it('should login successfully with a hashed password', async () => {
      const authAPI = new AuthAPI(app, BASE_URL);
      const payload = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      await authAPI.create(payload);
      const {
        statusCode,
        success,
        data: authData,
      } = await authAPI.login(payload);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(success).toBeTruthy();
      expect(authData.data).toHaveProperty('accessToken');
    });

    it('should fail 401 if password is incorrect', async () => {
      const authAPI = new AuthAPI(app, BASE_URL);
      const invalidPayload = {
        email: 'login-success@test.com',
        password: 'WrongPassword!',
      };

      const { statusCode } = await authAPI.login(invalidPayload);

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Auth logout (POST auth/logout)', () => {
    it('should logout successfully using MockAuthGuard', async () => {
      const authAPI = new AuthAPI(app, BASE_URL);
      const payload = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      await authAPI.create(payload);
      await authAPI.login(payload);
      await authAPI.syncMockGuard(payload.email, dataSource);

      const { statusCode, success, data: authData } = await authAPI.logout();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(success).toBeTruthy();
      expect(authData.message).toBe('Logout successful');
    });
  });

  describe('Auth recovery password (POST auth/recovery-password)', () => {
    it('should return 200 even if email does not exist (Security Best Practice)', async () => {
      return request(app.getHttpServer())
        .post(`${BASE_URL}/recovery-password`)
        .send({ email: 'nonexistent@test.com' })
        .expect(HttpStatus.OK);
    });
  });
});
