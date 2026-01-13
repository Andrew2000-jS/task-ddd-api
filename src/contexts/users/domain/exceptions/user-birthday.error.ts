import { InvalidArgumentError } from 'src/shared/contexts/exceptions/invalid-argument.error';

export class InvalidUserBirthdayError extends InvalidArgumentError {
  constructor() {
    super('Invalid birthday date');
  }
}

export class FutureUserBirthdayError extends InvalidArgumentError {
  constructor() {
    super('Birthday cannot be in the future');
  }
}
