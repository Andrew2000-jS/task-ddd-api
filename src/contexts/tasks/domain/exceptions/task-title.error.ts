import { InvalidArgumentError } from 'src/shared/contexts/domain/exceptions/invalid-argument.error';

export class TaskTitleTooShortError extends InvalidArgumentError {
  constructor() {
    super('Task title must be at least 3 characters long');
  }
}

export class TaskTitleTooLongError extends InvalidArgumentError {
  constructor() {
    super('Task title must be less than 100 characters');
  }
}

export class TaskTitleEmptyError extends InvalidArgumentError {
  constructor() {
    super('Task title cannot be empty');
  }
}
