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
import { ParamDto } from 'src/shared/contexts/infrastructure/dto/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';

@ApiTags('Task')
@Controller(API_V1_TASKS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class UpdateTaskController {
  constructor(private readonly useCase: UpdateTaskUseCase) {}

  @Patch(':id')
  @ApiOperation({
    summary: 'Update task details',
    description:
      "Modifies an existing task's information based on the provided ID.",
  })
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
