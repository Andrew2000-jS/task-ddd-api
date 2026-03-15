import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { NotFoundError } from 'src/shared/contexts/domain/exceptions/not-found.error';
import { AuthId } from '../../domain/value-objects/auth-id.vo';
import { ClientProxy } from '@nestjs/microservices';
import { UserDeletedEvent } from '../../events/user-deleted.event';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    @Inject('REDIS_SERVICE') private readonly redisClient: ClientProxy,
  ) {}

  async execute(id: string): Promise<void> {
    const authId = new AuthId(id);

    const user = await this.repository.findOne(authId);

    if (!user) throw new NotFoundError('user');

    await this.repository.delete(authId);

    const event = new UserDeletedEvent(authId.getValue());

    this.redisClient.emit(event.eventName, {
      aggregateId: event.aggregateId,
      ocurredOn: event.occurredOn,
    });
  }
}
