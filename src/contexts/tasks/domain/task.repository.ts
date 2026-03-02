import { PaginationResult } from 'src/shared/contexts/domain/pagination';
import { Task } from './task';
import { TaskId } from './value-objects/task-id.vo';
import { TaskSlug } from './value-objects/task-slug.vo';

export abstract class TaskRepository {
  abstract save(task: Task): Promise<void>;
  abstract findOne(taskId: TaskId): Promise<Task | null>;
  abstract findBySlug(slug: TaskSlug): Promise<Task | null>;
  abstract findAll(limit: number, offset: number): Promise<Task[]>;
  abstract findAndCount(
    limit: number,
    offset: number,
  ): Promise<PaginationResult<Task>>;
  abstract delete(taskId: TaskId): Promise<void>;
}
