import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../domain/task.repository';
import { PrimitiveTask } from '../../domain/task';
import { FindOneTaskDto } from './find-one-task.dto';
import { TaskId } from '../../domain/value-objects/task-id.vo';
import { TaskSlug } from '../../domain/value-objects/task-slug.vo';
import { NotFoundError } from 'src/shared/contexts/exceptions/not-found.error';

@Injectable()
export class FindOneTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute({ id, slug }: FindOneTaskDto): Promise<PrimitiveTask> {
    try {
      if (!id && !slug)
        throw new Error('You must provide either an id or a slug');

      const task = id
        ? await this.repository.findOne(new TaskId(id))
        : await this.repository.findBySlug(new TaskSlug(slug!));

      if (!task) throw new NotFoundError('task');

      return task.toPrimitives();
    } catch (error) {
      throw error;
    }
  }
}
