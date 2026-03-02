import { User } from './user';
import { AuthId } from './value-objects/auth-id.vo';
import { UserName } from './value-objects/username.vo';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByUsername(username: UserName): Promise<User | null>;
  abstract findOne(authId: AuthId): Promise<User | null>;
  abstract delete(authId: AuthId): Promise<void>;
}
