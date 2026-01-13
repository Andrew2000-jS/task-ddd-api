type Primitives = string | number | boolean | Date;

export abstract class ValueObject<T extends Primitives> {
  protected readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this.value === other.getValue();
  }

  public toString(): string {
    return String(this.value);
  }
}
