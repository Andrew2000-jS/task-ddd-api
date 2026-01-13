import { PrimitiveTask, Task } from '../../domain/task';
import { TaskRepository } from '../../domain/task.repository';
import { CreateTaskDto } from './create-task.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(data: CreateTaskDto): Promise<PrimitiveTask> {
    try {
      const task = Task.create(data);

      await this.repository.save(task);

      return task.toPrimitives();
    } catch (error) {
      throw error;
    }
  }
}
