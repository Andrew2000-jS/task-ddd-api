import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { clearDB, createAuth } from 'test/utils/db';
import { createTestingApp } from 'test/config/test.module';
import { CreateAuth } from 'test/utils/interfaces';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const BASE_URL = '/api/v1/auth';

  beforeAll(async () => {
    app = await createTestingApp();
    dataSource = app.get('DATA_SOURCE');
  });

  beforeEach(async () => clearDB(dataSource));

  afterAll(async () => {
    await app.close();
  });

  describe('/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/register`)
        .send(registerDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.statusCode).toBe(201);
    });
  });

  describe('/login (POST)', () => {
    it('should login successfully with a hashed password', async () => {
      const data: CreateAuth = {
        authID: '550e8400-e29b-41d4-a716-446655440001',
        rawPassword: 'Password123!',
        userEmail: 'login-success@test.com',
      };

      await createAuth(dataSource, data);
      const loginDto = {
        email: data.userEmail,
        password: data.rawPassword,
      };

      return request(app.getHttpServer())
        .post(`${BASE_URL}/login`)
        .send(loginDto)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { data, message } = res.body.data;
          expect(res.body.success).toBe(true);
          expect(data).toHaveProperty('accessToken');
          expect(message).toBe('Login successfully');
        });
    });

    it('should fail 401 if password is incorrect', async () => {
      const loginDto = {
        email: 'login-success@test.com',
        password: 'WrongPassword',
      };

      return request(app.getHttpServer())
        .post(`${BASE_URL}/login`)
        .send(loginDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/logout (POST) - Protected', () => {
    it('should logout successfully using MockAuthGuard', async () => {
      const data: CreateAuth = {
        authID: '550e8400-e29b-41d4-a716-446655440000',
        rawPassword: 'Password123!',
        userEmail: 'login-success@test.com',
      };

      await createAuth(dataSource, data);

      const payload = { id: '550e8400-e29b-41d4-a716-446655440000' };

      return request(app.getHttpServer())
        .post(`${BASE_URL}/logout`)
        .send(payload)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { message } = res.body.data;
          expect(res.body.success).toBe(true);
          expect(message).toBe('Logout successful');
        });
    });
  });

  describe('/recovery-password (POST)', () => {
    it('should return 200 even if email does not exist (Security Best Practice)', async () => {
      return request(app.getHttpServer())
        .post(`${BASE_URL}/recovery-password`)
        .send({ email: 'nonexistent@test.com' })
        .expect(HttpStatus.OK);
    });
  });
});
