import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateTaskControllerDto } from './create-task.ctr.dto';
import { API_V1_TASKS } from '../constants';
import { CreateTaskUseCase } from 'src/contexts/tasks/application/create-task/create-task.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_TASKS)
@UseGuards(AuthGuard)
export class CreateTaskController {
  constructor(private readonly useCase: CreateTaskUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async run(
    @Body() body: CreateTaskControllerDto,
    @Res() res: Response,
  ): Promise<void> {
    const newTask = await this.useCase.execute({
      title: body.title,
      slug: body.slug,
      description: body.description ?? null,
      isCompleted: body.isCompleted,
      userId: body.userId,
    });
    const response = ApiResponseFactory.success(newTask);
    res.status(HttpStatus.CREATED).json(response);
  }
}
