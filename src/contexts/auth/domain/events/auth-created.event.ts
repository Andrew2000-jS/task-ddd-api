import { DomainEvent } from 'src/shared/contexts/domain/events/domain-event';

export class AuthCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
  ) {
    super('auth.created', aggregateId);
  }
}
