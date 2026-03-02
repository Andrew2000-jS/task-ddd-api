import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';
import { AuthId } from '../../domain/value-objects/auth-id.vo';
import { UserName } from '../../domain/value-objects/username.vo';
import { UserEntity } from '../persistence/user.entity';
import { UserMapper } from '../utils/user.mapper';

@Injectable()
export class PostgresUserRepository extends UserRepository {
  private readonly repository: Repository<UserEntity>;

  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(UserEntity);
  }

  async save(user: User): Promise<void> {
    const entity = UserMapper.toPersistence(user);
    await this.repository.save(entity);
  }

  async findByUsername(username: UserName): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { username: username.getValue() },
      relations: ['tasks'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findOne(authId: AuthId): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { auth: { id: authId.getValue() } },
      relations: ['tasks'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async delete(authId: AuthId): Promise<void> {
    await this.repository.delete({
      auth: { id: authId.getValue() },
    });
  }
}
