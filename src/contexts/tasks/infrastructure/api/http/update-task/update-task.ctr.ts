import {
  Controller,
  Patch,
  Param,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UpdateTaskControllerDto } from './update-task.ctr.dto';
import { API_V1_TASKS } from '../constants';
import { UpdateTaskUseCase } from 'src/contexts/tasks/application/update-task/update-task.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { ParamDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_TASKS)
@UseGuards(AuthGuard)
export class UpdateTaskController {
  constructor(private readonly useCase: UpdateTaskUseCase) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async run(
    @Param() { id }: ParamDto,
    @Body() body: UpdateTaskControllerDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.useCase.execute(id, {
      title: body.title,
      slug: body.slug,
      description: body.description,
      isCompleted: body.isCompleted,
    });
    const response = ApiResponseFactory.success({
      message: 'Task Updated successfully',
    });
    res.status(HttpStatus.OK).json(response);
  }
}
