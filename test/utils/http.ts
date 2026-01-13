import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createAuth } from './db';
import request from 'supertest';
import { PrimitivesUser } from 'src/contexts/users/domain/user';

export interface CreateUserByHTTP {
  username: string;
  authId: string;
  email?: string;
  password?: string;
}

export const createUserByHttp = async (
  app: INestApplication,
  dataSource: DataSource,
  data: CreateUserByHTTP,
  url: string = '/api/v1/users',
): Promise<{ data: PrimitivesUser }> => {
  await createAuth(dataSource, {
    authID: data.authId,
    userEmail: data.email || `test-${Date.now()}@gmail.com`,
    rawPassword: data.password || 'Abc@12345',
  });

  const payload = {
    firstname: 'generic name',
    lastname: 'generic lastname',
    username: data.username,
    authId: data.authId,
    birthday: '1995-01-01',
  };

  const response = await request(app.getHttpServer())
    .post(url)
    .send(payload)
    .expect(HttpStatus.CREATED);

  return response.body;
};
