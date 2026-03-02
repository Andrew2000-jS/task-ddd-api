import { INestApplication } from '@nestjs/common';
import { ApiTest, ApiTestResponse } from './interfaces';
import request from 'supertest';

export interface Task {
  title: string;
  description: string;
  isCompleted: boolean;
  slug: string;
}

export class TaskAPI implements ApiTest {
  constructor(
    private app: INestApplication,
    private url: string,
    private id: string = '',
  ) {}

  async create({
    title,
    description,
    isCompleted = false,
    slug,
  }: Task): Promise<ApiTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post(this.url)
      .send({ title, description, isCompleted, slug });

    return {
      ...response.body,
      statusCode: response.statusCode,
    };
  }
}
