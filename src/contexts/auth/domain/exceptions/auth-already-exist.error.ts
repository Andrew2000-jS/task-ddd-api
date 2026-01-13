import { InvalidArgumentError } from 'src/shared/contexts/exceptions/invalid-argument.error';

export class AuthAlreadyExistError extends InvalidArgumentError {
  constructor(value: string) {
    super(`User with email ${value} already exists`);
  }
}
