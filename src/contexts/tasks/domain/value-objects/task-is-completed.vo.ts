import { ValueObject } from 'src/shared/contexts/domain/value-objects/value-objects';

export class TaskIsCompleted extends ValueObject<boolean> {
  constructor(value: boolean) {
    super(value);
  }

  public isDone(): boolean {
    return this.getValue() === true;
  }
}
