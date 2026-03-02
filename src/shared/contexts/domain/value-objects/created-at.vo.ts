import { ValueObject } from './value-objects';

export class CreatedAt extends ValueObject<Date> {
  constructor(value: Date) {
    CreatedAt.validate(value);
    super(value);
  }

  private static validate(value: Date): void {
    if (isNaN(value.getTime())) {
      throw new Error('Invalid date provided for CreatedAt');
    }
  }

  static now(): CreatedAt {
    return new CreatedAt(new Date());
  }
}
