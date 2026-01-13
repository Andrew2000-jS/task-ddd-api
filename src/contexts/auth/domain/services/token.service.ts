export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export abstract class TokenService {
  abstract generateTokens(payload: any): Promise<AuthTokens>;
  abstract verifyAccessToken(token: string): Promise<any>;
  abstract verifyRefreshToken(token: string): Promise<any>;
}
