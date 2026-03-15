import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DeleteAuthUseCase } from 'src/contexts/auth/application/delete-auth/delete-auth.application';

@Controller()
export class DeleteUserEventController {
  constructor(private readonly deleteAuth: DeleteAuthUseCase) {}

  @EventPattern('user.deleted')
  async handleUserDeleted(@Payload() data: { aggregateId: string }) {
    await this.deleteAuth.execute(data.aggregateId);
  }
}
