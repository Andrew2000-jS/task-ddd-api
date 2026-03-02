import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateUserUseCase } from 'src/contexts/users/application/create-user/create-user.application';

@Controller()
export class CreateUserEventController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @EventPattern('auth.created')
  async handleAuthCreated(@Payload() data: { aggregateId: string }) {
    await this.createUser.execute({
      firstname: null,
      lastname: null,
      username: null,
      birthday: null,
      authId: data.aggregateId,
    });
  }
}
