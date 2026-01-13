import { InvalidArgumentError } from 'src/shared/contexts/exceptions/invalid-argument.error';

export class TaskDescriptionTooShortError extends InvalidArgumentError {
  constructor(minLength: number) {
    super(`Task description must be at least ${minLength} characters long`);
  }
}
