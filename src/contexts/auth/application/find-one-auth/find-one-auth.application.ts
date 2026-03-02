import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/shared/contexts/domain/exceptions/not-found.error';
import { AuthRepository } from '../../domain/auth.repository';
import { PrimitivesAuth } from '../../domain/auth';
import { AuthId } from '../../domain/value-objects/auth-id.vo';

@Injectable()
export class FindOneAuthUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(id: string): Promise<PrimitivesAuth> {
    const authId = new AuthId(id);

    const auth = await this.repository.findOne(authId);

    if (!auth) throw new NotFoundError(`Auth record with ID ${id} not found`);

    return auth.toPrimitives();
  }
}
