import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../domain/task.repository';
import { PrimitiveTask, Task } from '../../domain/task';
import { UpdateTaskDto } from './update-task.dto';
import { TaskId } from '../../domain/value-objects/task-id.vo';
import { NotFoundError } from 'src/shared/contexts/domain/exceptions/not-found.error';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(id: string, data: UpdateTaskDto): Promise<PrimitiveTask> {
    const taskId = new TaskId(id);

    const task = await this.repository.findOne(taskId);

    if (!task) throw new NotFoundError('task');

    const p = task.toPrimitives();

    const description =
      data.description !== undefined ? data.description : p.description;

    const updatedTask = Task.fromPrimitives({
      ...p,
      title: data.title ?? p.title,
      slug: data.slug ?? p.slug,
      description,
      isCompleted: data.isCompleted ?? p.isCompleted,
      updatedAt: new Date(),
    });

    await this.repository.save(updatedTask);

    return updatedTask.toPrimitives();
  }
}
