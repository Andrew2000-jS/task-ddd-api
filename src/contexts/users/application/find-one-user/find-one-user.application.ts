import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { PrimitivesUser } from '../../domain/user';
import { NotFoundError } from 'src/shared/contexts/domain/exceptions/not-found.error';
import { AuthId } from '../../domain/value-objects/auth-id.vo';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<PrimitivesUser> {
    if (!id) throw new Error('You must provide a valid id');

    const user = await this.repository.findOne(new AuthId(id));

    if (!user) throw new NotFoundError('user');

    return user.toPrimitives();
  }
}
