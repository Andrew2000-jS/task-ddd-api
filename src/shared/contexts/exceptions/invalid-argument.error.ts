export class InvalidArgumentError extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = 'InvalidArgumentError';
  }
}
