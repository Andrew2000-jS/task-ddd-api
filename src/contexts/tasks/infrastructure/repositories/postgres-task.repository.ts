import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaskRepository } from '../../domain/task.repository';
import { TaskEntity } from '../persistence/task.entity';
import { Task } from '../../domain/task';
import { TaskId } from '../../domain/value-objects/task-id.vo';
import { TaskSlug } from '../../domain/value-objects/task-slug.vo';
import { TaskMapper } from '../utils/task.mapper';

@Injectable()
export class PostgresTaskRepository extends TaskRepository {
  private readonly repository: Repository<TaskEntity>;

  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(TaskEntity);
  }

  async save(task: Task): Promise<void> {
    const entity = TaskMapper.toPersistence(task);
    await this.repository.save(entity);
  }

  async findOne(taskId: TaskId): Promise<Task | null> {
    const entity = await this.repository.findOneBy({ id: taskId.getValue() });
    return entity ? TaskMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: TaskSlug): Promise<Task | null> {
    const entity = await this.repository.findOneBy({ slug: slug.getValue() });
    return entity ? TaskMapper.toDomain(entity) : null;
  }

  async findAll(limit: number, offset: number): Promise<Task[]> {
    const entities = await this.repository.find({
      take: limit,
      skip: offset,
      order: { title: 'ASC' },
    });

    return entities.map((entity) => TaskMapper.toDomain(entity));
  }

  async findAndCount(
    limit: number,
    offset: number,
  ): Promise<{ data: Task[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      data: entities.map((e) => TaskMapper.toDomain(e)),
      total,
    };
  }

  async delete(taskId: TaskId): Promise<void> {
    await this.repository.delete(taskId.getValue());
  }
}
