import { User } from './user';
import { AuthId } from './value-objects/auth-id.vo';
import { UserId } from './value-objects/user-id.vo';
import { UserName } from './value-objects/username.vo';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByUsername(username: UserName): Promise<User | null>;
  abstract findOne(userId: UserId): Promise<User | null>;
  abstract findAll(limit: number, offset: number): Promise<User[]>;
  abstract findByAuthId(authId: AuthId): Promise<User | null>;
  abstract delete(userId: UserId): Promise<void>;
}
