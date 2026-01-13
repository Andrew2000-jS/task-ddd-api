import { InvalidUuidError } from 'src/shared/contexts/exceptions/invalid-uuid.error';

export class UserTasks {
  private readonly value: string[];

  constructor(value: string[]) {
    UserTasks.validateArray(value);
    this.value = [...value];
  }

  private static validate(value: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new InvalidUuidError(value);
    }
  }

  private static validateArray(values: string[]): void {
    if (!Array.isArray(values)) {
      throw new Error('Tasks must be an array of strings');
    }
    values.forEach((id) => this.validate(id));
  }

  public getValue(): string[] {
    return [...this.value];
  }

  public hasTask(taskId: string): boolean {
    return this.value.includes(taskId);
  }

  public count(): number {
    return this.value.length;
  }
}
