import { ValueObject } from 'src/shared/contexts/value-objects/value-objects';
import {
  TaskTitleEmptyError,
  TaskTitleTooLongError,
  TaskTitleTooShortError,
} from '../exceptions/task-title.error';

export class TaskTitle extends ValueObject<string> {
  constructor(value: string) {
    TaskTitle.ensureIsValidTitle(value);
    super(value.trim());
  }

  private static ensureIsValidTitle(value: string): void {
    const trimmedTitle = value.trim();

    if (trimmedTitle.length === 0) throw new TaskTitleEmptyError();

    if (trimmedTitle.length < 3) throw new TaskTitleTooShortError();

    if (trimmedTitle.length > 100) throw new TaskTitleTooLongError();
  }
}
