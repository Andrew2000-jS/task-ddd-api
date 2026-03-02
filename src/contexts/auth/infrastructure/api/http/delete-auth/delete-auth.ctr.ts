import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { API_V1_AUTH } from '../constants';
import { DeleteAuthUseCase } from 'src/contexts/auth/application/delete-auth/delete-auth.application';
import type { Response } from 'express';
import { AuthGuard } from '../../../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/contexts/infrastructure/decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller(API_V1_AUTH)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class DeleteAuthController {
  constructor(private readonly useCase: DeleteAuthUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async run(
    @GetUser('sub') authId: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.useCase.execute(authId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
