import { AuthEntity } from 'src/contexts/auth/infrastructure/persistence/auth.entity';
import { TaskEntity } from 'src/contexts/tasks/infrastructure/persistence/task.entity';
import { UserEntity } from 'src/contexts/users/infrastructure/persistence/user.entity';
import { DataSource } from 'typeorm';
const env = process.env;

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: env.DB_HOST,
        port: Number(env.DB_PORT) || 5432,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        entities: [TaskEntity, UserEntity, AuthEntity],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
