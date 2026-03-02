import { ValueObject } from './value-objects';

export class UpdatedAt extends ValueObject<Date> {
  constructor(value: Date) {
    UpdatedAt.validate(value);
    super(value);
  }

  private static validate(value: Date): void {
    if (isNaN(value.getTime())) {
      throw new Error('Invalid date provided for UpdatedAt');
    }
  }

  static now(): UpdatedAt {
    return new UpdatedAt(new Date());
  }
}
