import {
  Controller,
  Delete,
  Param,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { API_V1_TASKS } from '../constants';
import { DeleteTaskUseCase } from 'src/contexts/tasks/application/delete-task/delete-task.application';
import { ParamDto } from 'src/shared/contexts/infrastructure/dto/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller(API_V1_TASKS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class DeleteTaskController {
  constructor(private readonly useCase: DeleteTaskUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async run(@Param() { id }: ParamDto, @Res() res: Response): Promise<void> {
    await this.useCase.execute(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
