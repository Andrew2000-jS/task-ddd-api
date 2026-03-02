export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string;
  public readonly aggregateId: string;

  constructor(eventName: string, aggregateId: string) {
    this.eventName = eventName;
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
  }
}
