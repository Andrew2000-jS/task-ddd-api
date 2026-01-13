import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { API_V1_TASKS } from '../constants';
import { FindAllTasksUseCase } from 'src/contexts/tasks/application/find-all-task/find-all-task.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { QueryAllCtrDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_TASKS)
@UseGuards(AuthGuard)
export class FindAllTasksController {
  constructor(private readonly useCase: FindAllTasksUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async run(
    @Query() { limit, offset }: QueryAllCtrDto,
    @Res() res: Response,
  ): Promise<void> {
    const tasks = await this.useCase.execute({
      limit,
      offset,
    });
    const response = ApiResponseFactory.success(tasks.data, {
      ...tasks.meta,
    });
    res.status(HttpStatus.OK).json(response);
  }
}
