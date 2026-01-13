import { randomUUID as v4 } from 'crypto';
import { TaskId } from './value-objects/task-id.vo';
import { TaskTitle } from './value-objects/task-title.vo';
import { TaskSlug } from './value-objects/task-slug.vo';
import { TaskDescription } from './value-objects/task-description.vo';
import { TaskIsCompleted } from './value-objects/task-is-completed.vo';
import { TaskUserId } from './value-objects/task-user-id.vo';
import { CreatedAt } from 'src/shared/contexts/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/contexts/value-objects/updated-at.vo';

export interface PrimitiveTask {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isCompleted: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  constructor(
    private readonly id: TaskId,
    private readonly title: TaskTitle,
    private readonly slug: TaskSlug,
    private readonly description: TaskDescription | null,
    private readonly isCompleted: TaskIsCompleted,
    private readonly userId: TaskUserId,
    private readonly createdAt: CreatedAt,
    private readonly updatedAt: UpdatedAt,
  ) {}

  static create(
    data: Omit<PrimitiveTask, 'id' | 'createdAt' | 'updatedAt'>,
  ): Task {
    const now = new Date();
    return new Task(
      new TaskId(v4()),
      new TaskTitle(data.title),
      new TaskSlug(data.slug),
      data.description ? new TaskDescription(data.description) : null,
      new TaskIsCompleted(data.isCompleted),
      new TaskUserId(data.userId),
      new CreatedAt(now),
      new UpdatedAt(now),
    );
  }

  static fromPrimitives(data: PrimitiveTask): Task {
    return new Task(
      new TaskId(data.id),
      new TaskTitle(data.title),
      new TaskSlug(data.slug),
      data.description ? new TaskDescription(data.description) : null,
      new TaskIsCompleted(data.isCompleted),
      new TaskUserId(data.userId),
      new CreatedAt(data.createdAt),
      new UpdatedAt(data.updatedAt),
    );
  }

  toPrimitives() {
    return {
      id: this.id.getValue(),
      title: this.title.getValue(),
      slug: this.slug.getValue(),
      description: this.description ? this.description.getValue() : null,
      isCompleted: this.isCompleted.getValue(),
      userId: this.userId.getValue(),
      createdAt: this.createdAt?.getValue(),
      updatedAt: this.updatedAt.getValue(),
    };
  }
}
