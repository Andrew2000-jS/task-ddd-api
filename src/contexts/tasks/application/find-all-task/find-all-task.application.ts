import { Injectable } from '@nestjs/common';
import { PrimitiveTask } from '../../domain/task';
import { TaskRepository } from '../../domain/task.repository';
import { QueryDTO } from 'src/shared/contexts/application/dto/query.dto';

export interface FindAllTasksResponse {
  data: PrimitiveTask[];
  meta: {
    total: number;
    page: number;
    limit: number;
    offset: number;
  };
}

@Injectable()
export class FindAllTasksUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(query: QueryDTO): Promise<FindAllTasksResponse> {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;

    try {
      const { data, total } = await this.repository.findAndCount(limit, offset);
      const tasksPrimitives = data.map((task) => task.toPrimitives());
      const currentPage = Math.floor(offset / limit) + 1;

      return {
        data: tasksPrimitives,
        meta: {
          total: total,
          page: currentPage,
          limit: limit,
          offset: offset,
        },
      };
    } catch (error) {
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: limit,
          offset: offset,
        },
      };
    }
  }
}
