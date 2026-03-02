import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../domain/auth.repository';
import { AuthId } from '../../domain/value-objects/auth-id.vo';
import { NotFoundError } from 'src/shared/contexts/domain/exceptions/not-found.error';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(authId: string): Promise<void> {
    const id = new AuthId(authId);
    const auth = await this.repository.findOne(id);

    if (!auth) throw new NotFoundError('Auth');

    auth.logout();

    await this.repository.save(auth);
  }
}
