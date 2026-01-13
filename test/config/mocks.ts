import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request['user'] = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
    };
    return true;
  }
}
