import { Module } from '@nestjs/common';
import { CreateTaskController } from './api/http/create-task/create-task.ctr';
import { UpdateTaskController } from './api/http/update-task/update-task.ctr';
import { DeleteTaskController } from './api/http/delete-task/delete-task.ctr';
import { FindAllTasksController } from './api/http/find-all-tasks/find-all-tasks.ctr';
import { FindOneTaskController } from './api/http/find-one-task/find-one-task.ctr';
import { CreateTaskUseCase } from '../application/create-task/create-task.application';
import { UpdateTaskUseCase } from '../application/update-task/update-task.application';
import { DeleteTaskUseCase } from '../application/delete-task/delete-task.application';
import { FindAllTasksUseCase } from '../application/find-all-task/find-all-task.application';
import { FindOneTaskUseCase } from '../application/find-one-task/find-one-task.application';
import { TaskRepository } from '../domain/task.repository';
import { PostgresTaskRepository } from './repositories/postgres-task.repository';
import { AuthModule } from 'src/contexts/auth/infrastructure/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    CreateTaskController,
    UpdateTaskController,
    DeleteTaskController,
    FindAllTasksController,
    FindOneTaskController,
  ],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    FindAllTasksUseCase,
    FindOneTaskUseCase,
    {
      provide: TaskRepository,
      useClass: PostgresTaskRepository,
    },
  ],
  exports: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    FindAllTasksUseCase,
    FindOneTaskUseCase,
  ],
})
export class TaskModule {}
