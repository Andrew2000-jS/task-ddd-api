import { randomUUID as v4 } from 'crypto';
import { CreatedAt } from 'src/shared/contexts/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/contexts/domain/value-objects/updated-at.vo';
import { AuthId } from './value-objects/auth-id.vo';
import { AuthEmail } from './value-objects/auth-email.vo';
import { AuthPassword } from './value-objects/auth-password.vo';
import { AuthRefreshToken } from './value-objects/auth-refresh-token.vo';
import { AuthResetToken } from './value-objects/auth-reset-token.vo';
import { AuthResetPasswordExpires } from './value-objects/auth-reset-password-expires.vo';
import { AuthLastLogin } from './value-objects/last-login.vo';
import { AuthUserId } from './value-objects/auth-user-id.vo';

type CreateAuthType = Omit<
  PrimitivesAuth,
  | 'id'
  | 'userId'
  | 'createdAt'
  | 'updatedAt'
  | 'refreshToken'
  | 'resetPasswordToken'
  | 'resetPasswordExpires'
  | 'lastLoging'
>;

export interface PrimitivesAuth {
  id: string;
  userId: string | null;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  lastLoging: Date | null;
}

export class Auth {
  constructor(
    private readonly id: AuthId,
    private readonly userId: AuthUserId | null,
    private readonly email: AuthEmail,
    private password: AuthPassword,
    private readonly createdAt: CreatedAt,
    private updatedAt: UpdatedAt,
    private refreshToken: AuthRefreshToken | null,
    private resetPasswordToken: AuthResetToken | null,
    private resetPasswordExpires: AuthResetPasswordExpires | null,
    private authLastLogin: AuthLastLogin | null,
  ) {}

  static create(data: CreateAuthType): Auth {
    const now = new Date();
    return new Auth(
      new AuthId(v4()),
      null,
      new AuthEmail(data.email),
      new AuthPassword(data.password),
      new CreatedAt(now),
      new UpdatedAt(now),
      null,
      null,
      null,
      null,
    );
  }

  static fromPrimitives(data: PrimitivesAuth): Auth {
    const refreshToken = data.refreshToken
      ? new AuthRefreshToken(data.refreshToken)
      : null;

    const resetPasswordToken = data.resetPasswordToken
      ? new AuthResetToken(data.resetPasswordToken)
      : null;

    const resetPasswordExpires = data.resetPasswordExpires
      ? new AuthResetPasswordExpires(data.resetPasswordExpires)
      : null;

    const lastLogin = data.lastLoging
      ? new AuthLastLogin(data.lastLoging)
      : null;

    const userId = data.userId ? new AuthUserId(data.userId) : null;

    return new Auth(
      new AuthId(data.id),
      userId,
      new AuthEmail(data.email),
      new AuthPassword(data.password),
      new CreatedAt(data.createdAt),
      new UpdatedAt(data.updatedAt),
      refreshToken,
      resetPasswordToken,
      resetPasswordExpires,
      lastLogin,
    );
  }

  logout(): void {
    this.refreshToken = null;
    this.touch();
  }

  updateRefreshToken(token: string): void {
    this.refreshToken = new AuthRefreshToken(token);
    this.touch();
  }

  isRefreshTokenValid(token: string): boolean {
    if (!this.refreshToken) return false;
    return this.refreshToken.getValue() === token;
  }

  setResetToken(token: string, expires: Date): void {
    this.resetPasswordToken = new AuthResetToken(token);
    this.resetPasswordExpires = new AuthResetPasswordExpires(expires);
    this.touch();
  }

  isResetTokenValid(token: string): boolean {
    if (
      !this.resetPasswordToken ||
      this.resetPasswordToken.getValue() !== token
    )
      return false;

    if (!this.resetPasswordExpires || this.resetPasswordExpires.isExpired())
      return false;

    return true;
  }

  changePassword(newPassword: AuthPassword): void {
    this.password = newPassword;
    this.logout();
    this.clearResetToken();
    this.touch();
  }

  clearResetToken(): void {
    this.resetPasswordToken = null;
    this.resetPasswordExpires = null;
  }

  async checkPassword(plainTextPassword: string): Promise<boolean> {
    return this.password.compare(plainTextPassword);
  }

  toPrimitives(): PrimitivesAuth {
    return {
      id: this.id.getValue(),
      userId: this.userId?.getValue() || null,
      email: this.email.getValue(),
      password: this.password.getValue(),
      createdAt: this.createdAt.getValue(),
      updatedAt: this.updatedAt.getValue(),
      refreshToken: this.refreshToken?.getValue() || null,
      resetPasswordToken: this.resetPasswordToken?.getValue() || null,
      resetPasswordExpires: this.resetPasswordExpires?.getValue() || null,
      lastLoging: this.authLastLogin?.getValue() || null,
    };
  }

  private touch(): void {
    this.updatedAt = new UpdatedAt(new Date());
  }

  updateLastLogin(): void {
    this.authLastLogin = AuthLastLogin.now();
    this.touch();
  }
}
