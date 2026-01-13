import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/shared/contexts/exceptions/not-found.error';
import { AuthRepository } from '../../domain/auth.repository';
import { AuthId } from '../../domain/value-objects/auth-id.vo';

@Injectable()
export class DeleteAuthUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(id: string): Promise<void> {
    const authId = new AuthId(id);

    const auth = await this.repository.findOne(authId);

    if (!auth) throw new NotFoundError('Authentication record not found');

    await this.repository.delete(authId);
  }
}
