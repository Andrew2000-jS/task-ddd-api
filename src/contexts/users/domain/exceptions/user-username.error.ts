import { InvalidArgumentError } from 'src/shared/contexts/domain/exceptions/invalid-argument.error';

export class UserNameTooShortError extends InvalidArgumentError {
  constructor(ctx: string) {
    super(`${ctx} must be at least 2 characters long`);
  }
}

export class UserNameTooLongError extends InvalidArgumentError {
  constructor(ctx: string) {
    super(`${ctx} must be less than 50 characters`);
  }
}

export class UserNameEmptyError extends InvalidArgumentError {
  constructor(ctx: string) {
    super(`${ctx} cannot be empty`);
  }
}
