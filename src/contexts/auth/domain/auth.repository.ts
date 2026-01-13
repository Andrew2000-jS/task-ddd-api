import { Auth } from './auth';
import { AuthEmail } from './value-objects/auth-email.vo';
import { AuthId } from './value-objects/auth-id.vo';

export abstract class AuthRepository {
  abstract save(auth: Auth): Promise<void>;
  abstract findOne(id: AuthId): Promise<Auth | null>;
  abstract findByEmail(email: AuthEmail): Promise<Auth | null>;
  abstract findByResetToken(token: string): Promise<Auth | null>;
  abstract delete(id: AuthId): Promise<void>;
}
