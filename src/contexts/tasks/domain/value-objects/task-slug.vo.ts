import { ValueObject } from 'src/shared/contexts/value-objects/value-objects';
import { InvalidTaskSlugError } from '../exceptions/task-slug.error';

export class TaskSlug extends ValueObject<string> {
  constructor(value: string) {
    TaskSlug.ensureIsValidSlug(value);
    super(value.trim());
  }

  private static ensureIsValidSlug(value: string): void {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slugRegex.test(value)) throw new InvalidTaskSlugError(value);
  }
}
