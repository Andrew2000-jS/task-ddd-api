import { InvalidArgumentError } from 'src/shared/contexts/exceptions/invalid-argument.error';

export class InvalidTaskSlugError extends InvalidArgumentError {
  constructor(value: string) {
    super(`<${value}> is not a valid slug`);
  }
}
