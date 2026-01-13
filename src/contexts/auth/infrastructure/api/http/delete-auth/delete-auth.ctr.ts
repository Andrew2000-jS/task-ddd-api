import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { API_V1_AUTH } from '../constants';
import { DeleteAuthUseCase } from 'src/contexts/auth/application/delete-auth/delete-auth.application';
import type { Response } from 'express';
import { ParamDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from '../../../guards/auth.guard';

@Controller(API_V1_AUTH)
@UseGuards(AuthGuard)
export class DeleteAuthController {
  constructor(private readonly useCase: DeleteAuthUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async run(@Param() { id }: ParamDto, @Res() res: Response): Promise<void> {
    await this.useCase.execute(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
