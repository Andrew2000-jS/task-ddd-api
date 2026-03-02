import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { NotFoundError } from 'src/shared/contexts/domain/exceptions/not-found.error';
import { AuthId } from '../../domain/value-objects/auth-id.vo';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const authId = new AuthId(id);

      const user = await this.repository.findOne(authId);

      if (!user) throw new NotFoundError('user');

      await this.repository.delete(authId);
    } catch (error) {
      throw error;
    }
  }
}
