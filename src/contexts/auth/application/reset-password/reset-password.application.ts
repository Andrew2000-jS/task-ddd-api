import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../domain/auth.repository';
import { AuthPassword } from '../../domain/value-objects/auth-password.vo';
import { UnauthorizedError } from 'src/shared/contexts/exceptions/unauthorized.error';
import { ResetPasswordDto } from './reset-password.dto';

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute({ token, newPassword }: ResetPasswordDto): Promise<void> {
    const auth = await this.repository.findByResetToken(token);

    if (!auth || !auth.isResetTokenValid(token))
      throw new UnauthorizedError('Invalid or expired recovery token');

    const hashedContext = await AuthPassword.create(newPassword);

    auth.changePassword(hashedContext);

    await this.repository.save(auth);
  }
}
