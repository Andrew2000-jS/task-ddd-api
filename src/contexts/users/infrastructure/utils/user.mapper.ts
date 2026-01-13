import { User } from '../../domain/user';
import { UserEntity } from '../persistence/user.entity';
import { AuthEntity } from '../../../auth/infrastructure/persistence/auth.entity';

export class UserMapper {
  static toPersistence(user: User): UserEntity {
    const primitives = user.toPrimitives();
    const entity = new UserEntity();
    entity.id = primitives.id;
    entity.firstname = primitives.firstname;
    entity.lastname = primitives.lastname;
    entity.username = primitives.username;
    entity.birthday = primitives.birthday;
    entity.auth = { id: primitives.authId } as AuthEntity;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    return User.fromPrimitives({
      id: entity.id,
      firstname: entity.firstname,
      lastname: entity.lastname,
      username: entity.username,
      birthday: entity.birthday,
      authId: entity.auth ? entity.auth.id : (entity as any).authId,
      tasks: entity.tasks ? entity.tasks.map((task) => task.id) : [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
