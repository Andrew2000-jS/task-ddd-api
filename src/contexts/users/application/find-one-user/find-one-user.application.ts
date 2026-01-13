import { Injectable } from '@nestjs/common';
import { FindOneUserDto } from './find-one-user.dto';
import { UserRepository } from '../../domain/user.repository';
import { PrimitivesUser } from '../../domain/user';
import { UserName } from '../../domain/value-objects/username.vo';
import { NotFoundError } from 'src/shared/contexts/exceptions/not-found.error';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute({ id, username }: FindOneUserDto): Promise<PrimitivesUser> {
    try {
      if (!id && !username)
        throw new Error('You must provide either an id or a username');

      const user = id
        ? await this.repository.findOne(new UserId(id))
        : await this.repository.findByUsername(new UserName(username!));

      if (!user) throw new NotFoundError('user');

      return user.toPrimitives();
    } catch (error) {
      throw error;
    }
  }
}
