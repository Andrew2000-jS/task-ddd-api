import { InvalidUuidError } from '../exceptions/invalid-uuid.error';
import { ValueObject } from './value-objects';

export class UUID extends ValueObject<string> {
  constructor(value: string) {
    UUID.validate(value);
    super(value);
  }

  private static validate(value: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) throw new InvalidUuidError(value);
  }
}
