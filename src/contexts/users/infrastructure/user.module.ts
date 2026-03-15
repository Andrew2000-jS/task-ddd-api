import { Module } from '@nestjs/common';
import { UpdateUserController } from './api/http/update-user/update-user.ctr';
import { DeleteUserController } from './api/http/delete-user/delete-user.ctr';
import { FindOneUserController } from './api/http/find-one-user/find-one-user.ctr';
import { CreateUserUseCase } from '../application/create-user/create-user.application';
import { UpdateUserUseCase } from '../application/update-user/update-user.application';
import { DeleteUserUseCase } from '../application/delete-user/delete-user.application';
import { FindOneUserUseCase } from '../application/find-one-user/find-one-user.application';
import { UserRepository } from '../domain/user.repository';
import { PostgresUserRepository } from './repositories/postgres-user.respository';
import { AuthModule } from 'src/contexts/auth/infrastructure/auth.module';
import { CreateUserEventController } from './api/events/create-user.event.ctr';

@Module({
  imports: [AuthModule],
  controllers: [
    CreateUserEventController,
    UpdateUserController,
    DeleteUserController,
    FindOneUserController,
  ],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindOneUserUseCase,
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
  ],
})
export class UserModule {}
