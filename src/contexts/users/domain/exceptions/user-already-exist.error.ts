import { InvalidArgumentError } from 'src/shared/contexts/domain/exceptions/invalid-argument.error';

export class UserAlreadyExistError extends InvalidArgumentError {
  constructor(username: string) {
    super(`Username <${username}> is already taken`);
  }
}
