import { Module } from '@nestjs/common';
import { CreateUserController } from './api/http/create-user/create-user.ctr';
import { UpdateUserController } from './api/http/update-user/update-user.ctr';
import { DeleteUserController } from './api/http/delete-user/delete-user.ctr';
import { FindOneUserController } from './api/http/find-one-user/find-one-user.ctr';
import { CreateUserUseCase } from '../application/create-user/create-user.application';
import { UpdateUserUseCase } from '../application/update-user/update-user.application';
import { DeleteUserUseCase } from '../application/delete-user/delete-user.application';
import { FindAllUsersUseCase } from '../application/find-all-user/find-all-user.application';
import { FindOneUserUseCase } from '../application/find-one-user/find-one-user.application';
import { UserRepository } from '../domain/user.repository';
import { PostgresUserRepository } from './repositories/postgres-user.respository';
import { DatabaseModule } from 'src/shared/contexts/database/database.module';
import { FindAllUsersController } from './api/http/find-all-users/find-all-users.ctr';
import { AuthModule } from 'src/contexts/auth/infrastructure/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    FindOneUserController,
    FindAllUsersController,
  ],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindOneUserUseCase,
    FindAllUsersUseCase,
    {
      provide: UserRepository,
      useClass: PostgresUserRepository,
    },
  ],
  exports: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindOneUserUseCase,
    FindAllUsersUseCase,
  ],
})
export class UserModule {}
