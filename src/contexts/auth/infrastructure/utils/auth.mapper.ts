import { Auth } from '../../domain/auth';
import { AuthEntity } from '../persistence/auth.entity';

export class AuthMapper {
  static toPersistence(auth: Auth): AuthEntity {
    const primitives = auth.toPrimitives();
    const entity = new AuthEntity();

    entity.id = primitives.id;
    entity.email = primitives.email;
    entity.password = primitives.password;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.refreshToken = primitives.refreshToken;
    entity.resetPasswordToken = primitives.resetPasswordToken;
    entity.resetPasswordExpires = primitives.resetPasswordExpires;

    return entity;
  }

  static toDomain(entity: AuthEntity): Auth {
    return Auth.fromPrimitives({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      refreshToken: entity.refreshToken,
      resetPasswordToken: entity.resetPasswordToken,
      resetPasswordExpires: entity.resetPasswordExpires,
    });
  }
}
