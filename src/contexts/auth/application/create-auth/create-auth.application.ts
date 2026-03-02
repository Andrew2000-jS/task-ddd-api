import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../domain/auth.repository';
import { CreateAuthDto } from './create-auth.dto';
import { AuthEmail } from '../../domain/value-objects/auth-email.vo';
import { AuthPassword } from '../../domain/value-objects/auth-password.vo';
import { Auth } from '../../domain/auth';
import { AuthAlreadyExistError } from '../../domain/exceptions/auth-already-exist.error';
import { ClientProxy } from '@nestjs/microservices';
import { AuthCreatedEvent } from '../../domain/events/auth-created.event';

@Injectable()
export class CreateAuthUseCase {
  constructor(
    private readonly repository: AuthRepository,
    @Inject('REDIS_SERVICE') private readonly redisClient: ClientProxy,
  ) {}

  async execute(data: CreateAuthDto): Promise<{ id: string }> {
    const email = new AuthEmail(data.email);
    const existingAuth = await this.repository.findByEmail(email);

    if (existingAuth) throw new AuthAlreadyExistError(data.email);

    const password = await AuthPassword.create(data.password);

    const auth = Auth.create({
      email: data.email,
      password: password.getValue(),
    });

    await this.repository.save(auth);

    const primitives = auth.toPrimitives();
    const event = new AuthCreatedEvent(primitives.id, primitives.email);

    this.redisClient.emit(event.eventName, {
      aggregateId: event.aggregateId,
      email: event.email,
      occurredOn: event.occurredOn,
    });

    return { id: auth.toPrimitives().id };
  }
}
