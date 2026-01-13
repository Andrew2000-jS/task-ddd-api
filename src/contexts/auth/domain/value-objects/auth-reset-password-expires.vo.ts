import { ValueObject } from 'src/shared/contexts/value-objects/value-objects';

export class AuthResetPasswordExpires extends ValueObject<Date> {
  isExpired(): boolean {
    return new Date().getTime() > this.value.getTime();
  }
}
