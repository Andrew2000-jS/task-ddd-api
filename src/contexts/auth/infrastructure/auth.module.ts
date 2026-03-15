import { Module } from '@nestjs/common';
import { CreateAuthUseCase } from '../application/create-auth/create-auth.application';
import { DeleteAuthUseCase } from '../application/delete-auth/delete-auth.application';
import { FindByEmailAuthUseCase } from '../application/find-by-email-auth/find-by-email.application';
import { FindOneAuthUseCase } from '../application/find-one-auth/find-one-auth.application';
import { LoginUseCase } from '../application/login/login.application';
import { LogoutUseCase } from '../application/logout/logout.application';
import { RecoveryPasswordUseCase } from '../application/recovery-password/recovery-password.application';
import { ResetPasswordUseCase } from '../application/reset-password/reset-password.application';
import { AuthRepository } from '../domain/auth.repository';
import { PostgresAuthRepository } from './repositories/postgres-auth.repository';
import { CreateAuthController } from './api/http/create-auth/create-auth.ctr';
import { LoginController } from './api/http/login/login.ctr';
import { LogoutController } from './api/http/logout/logout.ctr';
import { RecoveryPasswordController } from './api/http/recovery-password/recovery-password.ctr';
import { ResetPasswordController } from './api/http/reset-password/reset-password.ctr';
import { TokenService } from '../domain/services/token.service';
import { JwtTokenService } from './services/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { DeleteUserEventController } from './api/events/delete-user.event.ctr';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthGuard,
    CreateAuthUseCase,
    DeleteAuthUseCase,
    FindByEmailAuthUseCase,
    FindOneAuthUseCase,
    LoginUseCase,
    LogoutUseCase,
    RecoveryPasswordUseCase,
    ResetPasswordUseCase,
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
    {
      provide: AuthRepository,
      useClass: PostgresAuthRepository,
    },
  ],
  controllers: [
    CreateAuthController,
    DeleteUserEventController,
    LoginController,
    LogoutController,
    RecoveryPasswordController,
    ResetPasswordController,
  ],
  exports: [
    CreateAuthUseCase,
    DeleteAuthUseCase,
    FindByEmailAuthUseCase,
    FindOneAuthUseCase,
    LoginUseCase,
    LogoutUseCase,
    RecoveryPasswordUseCase,
    ResetPasswordUseCase,
    TokenService,
    AuthGuard,
  ],
})
export class AuthModule {}
