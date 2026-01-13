import { Injectable } from '@nestjs/common';
import { QueryDTO } from 'src/shared/contexts/types/query.dto';
import { PrimitivesUser } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';

export interface FindAllUsersResponse {
  data: PrimitivesUser[];
  meta: {
    page: number;
    limit: number;
    offset: number;
  };
}

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: QueryDTO): Promise<FindAllUsersResponse> {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;

    try {
      const data = await this.repository.findAll(limit, offset);
      const usersPrimitives = data.map((users) => users.toPrimitives());
      const currentPage = Math.floor(offset / limit) + 1;

      return {
        data: usersPrimitives,
        meta: {
          page: currentPage,
          limit: limit,
          offset: offset,
        },
      };
    } catch (error) {
      return {
        data: [],
        meta: {
          page: 1,
          limit: limit,
          offset: offset,
        },
      };
    }
  }
}
