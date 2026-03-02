import { ValueObject } from 'src/shared/contexts/domain/value-objects/value-objects';
import {
  UserNameEmptyError,
  UserNameTooLongError,
  UserNameTooShortError,
} from '../exceptions/user-username.error';

export class UserName extends ValueObject<string> {
  constructor(value: string) {
    UserName.validate(value);
    super(value.trim());
  }

  protected static validate(value: string, ctx: string = 'User name'): void {
    const trimmed = value.trim();
    if (trimmed.length === 0) throw new UserNameEmptyError(ctx);

    if (!value || trimmed.length < 2) throw new UserNameTooShortError(ctx);

    if (trimmed.length > 50) throw new UserNameTooLongError(ctx);
  }
}
