import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/contexts/auth/domain/services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException('Authorization header is missing');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException(
        'Invalid token format. Use Bearer <token>',
      );

    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      req['user'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Access denied: Invalid or expired token',
      );
    }
  }
}
