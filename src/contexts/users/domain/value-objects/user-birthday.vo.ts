import { ValueObject } from 'src/shared/contexts/value-objects/value-objects';
import {
  FutureUserBirthdayError,
  InvalidUserBirthdayError,
} from '../exceptions/user-birthday.error';

export class UserBirthday extends ValueObject<Date> {
  constructor(value: Date) {
    const date = typeof value === 'string' ? new Date(value) : value;
    UserBirthday.validate(date);
    super(date);
  }

  private static validate(date: Date): void {
    if (isNaN(date.getTime())) throw new InvalidUserBirthdayError();
    if (date > new Date()) throw new FutureUserBirthdayError();
  }
}
