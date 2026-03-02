import { InvalidArgumentError } from 'src/shared/contexts/domain/exceptions/invalid-argument.error';

export class InvalidTaskSlugError extends InvalidArgumentError {
  constructor(value: string) {
    super(`<${value}> is not a valid slug`);
  }
}
