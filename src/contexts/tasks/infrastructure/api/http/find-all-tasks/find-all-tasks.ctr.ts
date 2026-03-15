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
import { QueryAllCtrDto } from 'src/shared/contexts/infrastructure/dto/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';

@ApiTags('Task')
@Controller(API_V1_TASKS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class FindAllTasksController {
  constructor(private readonly useCase: FindAllTasksUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all tasks',
    description:
      'Fetches a complete list of tasks associated with the authenticated user.',
  })
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
