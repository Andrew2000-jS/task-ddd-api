import { Inject, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Auth } from '../../domain/auth';
import { AuthRepository } from '../../domain/auth.repository';
import { AuthEmail } from '../../domain/value-objects/auth-email.vo';
import { AuthId } from '../../domain/value-objects/auth-id.vo';
import { AuthEntity } from '../persistence/auth.entity';
import { AuthMapper } from '../utils/auth.mapper';

@Injectable()
export class PostgresAuthRepository extends AuthRepository {
  private readonly repository: Repository<AuthEntity>;

  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(AuthEntity);
  }

  async save(auth: Auth): Promise<void> {
    const entity = AuthMapper.toPersistence(auth);
    await this.repository.save(entity);
  }

  async findOne(id: AuthId): Promise<Auth | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });

    return entity ? AuthMapper.toDomain(entity) : null;
  }

  async findByEmail(email: AuthEmail): Promise<Auth | null> {
    const entity = await this.repository.findOne({
      where: { email: email.getValue() },
    });

    return entity ? AuthMapper.toDomain(entity) : null;
  }

  async findByResetToken(token: string): Promise<Auth | null> {
    const entity = await this.repository.findOne({
      where: { resetPasswordToken: token },
    });

    return entity ? AuthMapper.toDomain(entity) : null;
  }

  async delete(id: AuthId): Promise<void> {
    await this.repository.delete(id.getValue());
  }
}
