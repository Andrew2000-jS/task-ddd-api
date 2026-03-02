import { ValueObject } from 'src/shared/contexts/domain/value-objects/value-objects';

export class AuthLastLogin extends ValueObject<Date> {
  constructor(value: Date | string) {
    const dateValue = typeof value === 'string' ? new Date(value) : value;

    AuthLastLogin.validate(dateValue);
    super(dateValue);
  }

  private static validate(date: Date): void {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid last login date');
    }

    if (date > new Date(new Date().getTime() + 1000 * 60)) {
      throw new Error('Last login date cannot be in the future');
    }
  }

  public static now(): AuthLastLogin {
    return new AuthLastLogin(new Date());
  }
}
