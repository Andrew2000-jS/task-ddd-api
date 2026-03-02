import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../domain/auth.repository';
import { TokenService } from '../../domain/services/token.service';
import { AuthEmail } from '../../domain/value-objects/auth-email.vo';
import { UnauthorizedError } from 'src/shared/contexts/domain/exceptions/unauthorized.error';
import { LoginDto } from './login.dto';
import { AuthTokens } from '../../domain/services/token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute({ email, password }: LoginDto): Promise<AuthTokens> {
    const emailVO = new AuthEmail(email);

    const auth = await this.repository.findByEmail(emailVO);
    if (!auth) throw new UnauthorizedError('Invalid email or password');

    const isValid = await auth.checkPassword(password);
    if (!isValid) throw new UnauthorizedError('Invalid email or password');

    const primitives = auth.toPrimitives();
    const tokens = await this.tokenService.generateTokens({
      sub: primitives.id,
      email: primitives.email,
      userId: primitives.userId,
    });

    auth.updateLastLogin();
    auth.updateRefreshToken(tokens.refreshToken);

    await this.repository.save(auth);

    return tokens;
  }
}
