import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { NotFoundError } from 'src/shared/contexts/exceptions/not-found.error';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const userId = new UserId(id);

      const user = await this.repository.findOne(userId);

      if (!user) throw new NotFoundError('user');

      await this.repository.delete(userId);
    } catch (error) {
      throw error;
    }
  }
}
