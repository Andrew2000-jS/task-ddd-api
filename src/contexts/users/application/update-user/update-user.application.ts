import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';
import { UserRepository } from '../../domain/user.repository';
import { PrimitivesUser, User } from '../../domain/user';
import { NotFoundError } from 'src/shared/contexts/domain/exceptions/not-found.error';
import { UserName } from '../../domain/value-objects/username.vo';
import { UserAlreadyExistError } from '../../domain/exceptions/user-already-exist.error';
import { AuthId } from '../../domain/value-objects/auth-id.vo';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string, data: UpdateUserDto): Promise<PrimitivesUser> {
    const authId = new AuthId(id);

    const user = await this.repository.findOne(authId);

    if (!user) throw new NotFoundError('user');

    const currentPrimitives = user.toPrimitives();

    if (data.username && data.username !== currentPrimitives.username) {
      const usernameTaken = await this.repository.findByUsername(
        new UserName(data.username),
      );
      if (usernameTaken) throw new UserAlreadyExistError(data.username);
    }

    const updatedUser = User.fromPrimitives({
      ...currentPrimitives,
      firstname: data.firstname ?? currentPrimitives.firstname,
      lastname: data.lastname ?? currentPrimitives.lastname,
      username: data.username ?? currentPrimitives.username,
      birthday: data.birthday ?? currentPrimitives.birthday,
      tasks: currentPrimitives.tasks,
      authId: currentPrimitives.authId,
      updatedAt: new Date(),
    });

    await this.repository.save(updatedUser);

    return updatedUser.toPrimitives();
  }
}
