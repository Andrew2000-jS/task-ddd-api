import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateTaskControllerDto } from './create-task.ctr.dto';
import { API_V1_TASKS } from '../constants';
import { CreateTaskUseCase } from 'src/contexts/tasks/application/create-task/create-task.application';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';
import { GetUser } from 'src/shared/contexts/infrastructure/decorators/get-user.decorator';

@ApiTags('Task')
@Controller(API_V1_TASKS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class CreateTaskController {
  constructor(private readonly useCase: CreateTaskUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      "Adds a new task to the user's collection with the provided details.",
  })
  @HttpCode(HttpStatus.CREATED)
  async run(
    @Body() body: CreateTaskControllerDto,
    @GetUser('userId') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const newTask = await this.useCase.execute({
      title: body.title,
      slug: body.slug,
      description: body.description ?? null,
      isCompleted: body.isCompleted,
      userId,
    });
    const response = ApiResponseFactory.success(newTask);
    res.status(HttpStatus.CREATED).json(response);
  }
}
