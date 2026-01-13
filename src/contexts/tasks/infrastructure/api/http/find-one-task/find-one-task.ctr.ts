import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { FindOneTaskQueryDto } from './find-one-task.ctr.dto';
import { API_V1_TASKS } from '../constants';
import { FindOneTaskUseCase } from 'src/contexts/tasks/application/find-one-task/find-one-task.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { ParamDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_TASKS)
@UseGuards(AuthGuard)
export class FindOneTaskController {
  constructor(private readonly useCase: FindOneTaskUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async run(
    @Param() { id }: ParamDto,
    @Query() { slug }: FindOneTaskQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const task = await this.useCase.execute({
      id: id,
      slug,
    });
    const response = ApiResponseFactory.success(task);
    res.status(HttpStatus.OK).json(response);
  }
}
