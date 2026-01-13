import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { LogoutUseCase } from 'src/contexts/auth/application/logout/logout.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { API_V1_AUTH } from '../constants';
import { ParamDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from '../../../guards/auth.guard';

@Controller(API_V1_AUTH)
@UseGuards(AuthGuard)
export class LogoutController {
  constructor(private readonly useCase: LogoutUseCase) {}

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async handle(@Body() { id }: ParamDto, @Res() res: Response) {
    await this.useCase.execute(id);

    const response = ApiResponseFactory.success({
      message: 'Logout successful',
    });

    res.status(HttpStatus.OK).json(response);
  }
}
