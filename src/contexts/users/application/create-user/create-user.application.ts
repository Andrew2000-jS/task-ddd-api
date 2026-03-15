import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { CreateUserDto } from './create-user.dto';
import { PrimitivesUser, User } from '../../domain/user';
import { UserName } from '../../domain/value-objects/username.vo';
import { UserAlreadyExistError } from '../../domain/exceptions/user-already-exist.error';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<PrimitivesUser> {
    if (data.username) {
      const username = new UserName(data.username);
      const existingUser = await this.repository.findByUsername(username);

      if (existingUser) throw new UserAlreadyExistError(data.username);
    }

    const user = User.create({
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      birthday: data.birthday,
      authId: data.authId,
    });

    await this.repository.save(user);

    return user.toPrimitives();
  }
}
