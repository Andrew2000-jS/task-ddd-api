import { INestApplication } from '@nestjs/common';
import { ApiTest, ApiTestResponse } from './interfaces';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { MockAuthGuard } from 'test/config/mocks';

interface Auth {
  email: string;
  password: string;
}

export class AuthAPI implements ApiTest {
  constructor(
    private app: INestApplication,
    private url: string,
  ) {}

  async create({ email, password }: Auth): Promise<ApiTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post(`${this.url}/register`)
      .send({ email, password });

    return {
      ...response.body,
      statusCode: response.statusCode,
    };
  }

  async login({ email, password }: Auth): Promise<ApiTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post(`${this.url}/login`)
      .send({ email, password });

    return {
      ...response.body,
      statusCode: response.statusCode,
    };
  }

  async logout(): Promise<ApiTestResponse> {
    const response = await request(this.app.getHttpServer()).post(
      `${this.url}/logout`,
    );

    return {
      ...response.body,
      statusCode: response.statusCode,
    };
  }

  async waitForUserCreation(
    dataSource: DataSource,
    email: string,
    retries = 10,
    delayMs = 100,
  ): Promise<void> {
    for (let i = 0; i < retries; i++) {
      const [auth] = await dataSource.query(
        `SELECT id FROM "auth" WHERE email = $1`,
        [email],
      );

      if (auth) {
        const [user] = await dataSource.query(
          `SELECT id FROM "users" WHERE "authId" = $1`,
          [auth.id],
        );
        if (user) {
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(
      `Timeout waiting for User creation for auth email: ${email}`,
    );
  }

  async syncMockGuard(email: string, dataSource: DataSource): Promise<void> {
    const [auth] = await dataSource.query(
      `SELECT id FROM "auth" WHERE email = $1`,
      [email],
    );

    if (!auth) throw new Error(`Auth with email ${email} not found in DB`);

    const [user] = await dataSource.query(
      `SELECT id FROM "users" WHERE "authId" = $1`,
      [auth.id],
    );

    if (!user)
      throw new Error(`User related to auth email ${email} not found in DB`);

    MockAuthGuard.mockUser = {
      sub: auth.id,
      email: email,
      userId: user.id,
    };
  }
}
