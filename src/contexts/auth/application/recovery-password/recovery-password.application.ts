import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuthRepository } from '../../domain/auth.repository';
import { AuthEmail } from '../../domain/value-objects/auth-email.vo';

@Injectable()
export class RecoveryPasswordUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(email: string): Promise<void> {
    const emailVO = new AuthEmail(email);
    const auth = await this.repository.findByEmail(emailVO);

    if (!auth) return;

    const token = randomBytes(20).toString('hex');

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    auth.setResetToken(token, expires);

    await this.repository.save(auth);
  }
}
