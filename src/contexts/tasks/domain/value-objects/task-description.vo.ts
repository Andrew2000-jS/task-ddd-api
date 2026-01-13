import { ValueObject } from 'src/shared/contexts/value-objects/value-objects';
import { TaskDescriptionTooShortError } from '../exceptions/task-description.error';

export class TaskDescription extends ValueObject<string> {
  constructor(value: string) {
    const trimmed = value.trim();
    TaskDescription.validate(trimmed);
    super(trimmed);
  }

  private static validate(value: string): void {
    const MIN_LENGTH = 10;

    if (value.length < MIN_LENGTH)
      throw new TaskDescriptionTooShortError(MIN_LENGTH);
  }
}
