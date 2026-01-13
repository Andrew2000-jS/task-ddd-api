export class NotFoundError extends Error {
  constructor(ctx: string) {
    super(`This ${ctx} is not found`);
  }
}
