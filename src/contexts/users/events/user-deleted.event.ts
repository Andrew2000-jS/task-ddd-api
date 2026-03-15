import { DomainEvent } from 'src/shared/contexts/domain/events/domain-event';

export class UserDeletedEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super('user.deleted', aggregateId);
  }
}
