import { ValueObject } from 'src/shared/contexts/value-objects/value-objects';
import { InvalidAuthEmailError } from '../exceptions/auth-email.error';

export class AuthEmail extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new InvalidAuthEmailError(value);
    }
  }
}