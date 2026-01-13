import { Task } from '../../domain/task';
import { TaskEntity } from '../persistence/task.entity';

export class TaskMapper {
  static toPersistence(task: Task): TaskEntity {
    const primitives = task.toPrimitives();
    const entity = new TaskEntity();
    entity.id = primitives.id;
    entity.title = primitives.title;
    entity.slug = primitives.slug;
    entity.description = primitives.description;
    entity.isCompleted = primitives.isCompleted;
    entity.userId = primitives.userId;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    return entity;
  }

  static toDomain(entity: TaskEntity): Task {
    return Task.fromPrimitives({
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      isCompleted: entity.isCompleted,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
