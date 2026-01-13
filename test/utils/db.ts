import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuth, CreateTask, CreateUser } from './interfaces';

export const clearDB = async (dataSource: DataSource) => {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
  }
};

export const createAuth = async (dataSource: DataSource, data: CreateAuth) => {
  const hashedPassword = await bcrypt.hash(data.rawPassword, 10);

  await dataSource.query(
    `INSERT INTO "auth" (id, email, password) VALUES ($1, $2, $3)`,
    [data.authID, data.userEmail, hashedPassword],
  );
};

export async function createUser(dataSource: DataSource, data: CreateUser) {
  await dataSource.query(
    `INSERT INTO "users" (
      "id", 
      "firstname", 
      "lastname", 
      "username", 
      "birthday", 
      "authId", 
      "createdAt", 
      "updatedAt"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
    [data.userID, 'John', 'Doe', data.username, '1990-01-01', data.authId],
  );
}

export async function createTask(dataSource: DataSource, data: CreateTask) {
  await dataSource.query(
    `INSERT INTO "tasks" (
      "id", 
      "title", 
      "slug", 
      "description", 
      "isCompleted", 
      "userId", 
      "createdAt", 
      "updatedAt"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
    [
      data.taskID,
      data.title,
      data.slug,
      data.description ?? null,
      data.isCompleted ?? false,
      data.userId,
    ],
  );
}
