import { InvalidArgumentError } from 'src/shared/contexts/domain/exceptions/invalid-argument.error';

export class PasswordTooShortError extends InvalidArgumentError {
  constructor() {
    super('Password must be at least 8 characters long');
  }
}

export class InvalidAuthPasswordError extends InvalidArgumentError {
  constructor() {
    super('Password must contain both letters and numbers');
  }
}
