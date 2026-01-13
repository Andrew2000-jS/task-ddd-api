import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { API_V1_USERS } from '../constants';
import { DeleteUserUseCase } from 'src/contexts/users/application/delete-user/delete-user.application';
import { ParamDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_USERS)
@UseGuards(AuthGuard)
export class DeleteUserController {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async run(@Param() { id }: ParamDto, @Res() res: Response): Promise<void> {
    await this.useCase.execute(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
