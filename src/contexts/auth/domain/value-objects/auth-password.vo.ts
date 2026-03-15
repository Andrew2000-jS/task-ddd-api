import { ValueObject } from 'src/shared/contexts/domain/value-objects/value-objects';
import * as bcrypt from 'bcrypt';
import {
  InvalidAuthPasswordError,
  PasswordTooShortError,
} from '../exceptions/auth-password.error';

export class AuthPassword extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  static async create(plainText: string): Promise<AuthPassword> {
    this.validatePlain(plainText);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainText, salt);

    return new AuthPassword(hash);
  }

  async compare(plainText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, this.value);
  }

  private static validatePlain(plainText: string): void {
    if (!plainText || plainText.length < 8) throw new PasswordTooShortError();

    const hasNumber = /\d/.test(plainText);
    const hasLetter = /[a-zA-Z]/.test(plainText);

    if (!hasNumber || !hasLetter) throw new InvalidAuthPasswordError();
  }
}
