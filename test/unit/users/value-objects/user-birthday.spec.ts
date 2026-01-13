import {
  FutureUserBirthdayError,
  InvalidUserBirthdayError,
} from 'src/contexts/users/domain/exceptions/user-birthday.error';
import { UserBirthday } from 'src/contexts/users/domain/value-objects/user-birthday.vo';

describe('UserBirthday Value Object', () => {
  it('should create a valid UserBirthday for a past date', () => {
    const pastDate = new Date('1990-01-01');
    const vo = new UserBirthday(pastDate);

    expect(vo.getValue()).toEqual(pastDate);
    expect(vo.getValue()).toBeInstanceOf(Date);
  });

  it('should create a valid UserBirthday for today', () => {
    const today = new Date();
    const vo = new UserBirthday(today);

    expect(vo.getValue()).toEqual(today);
  });

  it('should throw InvalidUserBirthdayError for an invalid Date object', () => {
    const invalidDate = new Date('not-a-date');

    expect(() => new UserBirthday(invalidDate)).toThrow(
      InvalidUserBirthdayError,
    );
  });

  it('should throw FutureUserBirthdayError for a date in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    expect(() => new UserBirthday(futureDate)).toThrow(FutureUserBirthdayError);
  });

  it('should throw FutureUserBirthdayError for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(() => new UserBirthday(tomorrow)).toThrow(FutureUserBirthdayError);
  });
});
