import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../domain/task.repository';
import { TaskId } from '../../domain/value-objects/task-id.vo';
import { NotFoundError } from 'src/shared/contexts/exceptions/not-found.error';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const taskId = new TaskId(id);

      const task = await this.repository.findOne(taskId);
      if (!task) throw new NotFoundError('task');

      await this.repository.delete(taskId);
    } catch (error) {
      throw error;
    }
  }
}
