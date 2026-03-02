import { InvalidArgumentError } from './invalid-argument.error';

export class InvalidUuidError extends InvalidArgumentError {
  constructor(value: string) {
    super(`<${value}> is not a valid UUID (UUID v4 expected)`);
  }
}
