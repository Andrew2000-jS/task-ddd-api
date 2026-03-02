import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { LogoutUseCase } from 'src/contexts/auth/application/logout/logout.application';
import { API_V1_AUTH } from '../constants';
import { AuthGuard } from '../../../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';
import { GetUser } from 'src/shared/contexts/infrastructure/decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller(API_V1_AUTH)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class LogoutController {
  constructor(private readonly useCase: LogoutUseCase) {}

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async handle(@GetUser('sub') authId: string, @Res() res: Response) {
    await this.useCase.execute(authId);

    const response = ApiResponseFactory.success({
      message: 'Logout successful',
    });

    res.status(HttpStatus.OK).json(response);
  }
}
