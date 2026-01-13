import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/shared/contexts/exceptions/not-found.error';
import { AuthRepository } from '../../domain/auth.repository';
import { PrimitivesAuth } from '../../domain/auth';
import { AuthEmail } from '../../domain/value-objects/auth-email.vo';

@Injectable()
export class FindByEmailAuthUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(email: string): Promise<PrimitivesAuth> {
    const emailVO = new AuthEmail(email);

    const auth = await this.repository.findByEmail(emailVO);

    if (!auth) throw new NotFoundError(`Auth with email ${email} not found`);

    return auth.toPrimitives();
  }
}
