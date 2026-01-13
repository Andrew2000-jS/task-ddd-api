import { randomUUID as v4 } from 'crypto';
import { CreatedAt } from 'src/shared/contexts/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/contexts/value-objects/updated-at.vo';
import { AuthId } from './value-objects/auth-id.vo';
import { AuthEmail } from './value-objects/auth-email.vo';
import { AuthPassword } from './value-objects/auth-password.vo';
import { AuthRefreshToken } from './value-objects/auth-refresh-token.vo';
import { AuthResetToken } from './value-objects/auth-reset-token.vo';
import { AuthResetPasswordExpires } from './value-objects/auth-reset-password-expires.vo';

type CreateAuthType = Omit<
  PrimitivesAuth,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'refreshToken'
  | 'resetPasswordToken'
  | 'resetPasswordExpires'
>;

export interface PrimitivesAuth {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
}

export class Auth {
  constructor(
    private readonly id: AuthId,
    private readonly email: AuthEmail,
    private password: AuthPassword,
    private readonly createdAt: CreatedAt,
    private updatedAt: UpdatedAt,
    private refreshToken: AuthRefreshToken | null,
    private resetPasswordToken: AuthResetToken | null,
    private resetPasswordExpires: AuthResetPasswordExpires | null,
  ) {}

  static create(data: CreateAuthType): Auth {
    const now = new Date();
    return new Auth(
      new AuthId(v4()),
      new AuthEmail(data.email),
      new AuthPassword(data.password),
      new CreatedAt(now),
      new UpdatedAt(now),
      null,
      null,
      null,
    );
  }

  static fromPrimitives(data: PrimitivesAuth): Auth {
    return new Auth(
      new AuthId(data.id),
      new AuthEmail(data.email),
      new AuthPassword(data.password),
      new CreatedAt(data.createdAt),
      new UpdatedAt(data.updatedAt),
      data.refreshToken ? new AuthRefreshToken(data.refreshToken) : null,
      data.resetPasswordToken
        ? new AuthResetToken(data.resetPasswordToken)
        : null,
      data.resetPasswordExpires
        ? new AuthResetPasswordExpires(data.resetPasswordExpires)
        : null,
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
      email: this.email.getValue(),
      password: this.password.getValue(),
      createdAt: this.createdAt.getValue(),
      updatedAt: this.updatedAt.getValue(),
      refreshToken: this.refreshToken?.getValue() ?? null,
      resetPasswordToken: this.resetPasswordToken?.getValue() ?? null,
      resetPasswordExpires: this.resetPasswordExpires?.getValue() ?? null,
    };
  }

  private touch(): void {
    this.updatedAt = new UpdatedAt(new Date());
  }
}
