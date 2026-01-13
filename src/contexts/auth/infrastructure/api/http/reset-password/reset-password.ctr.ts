import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ResetPasswordUseCase } from 'src/contexts/auth/application/reset-password/reset-password.application';
import { ResetPasswordDto } from './reset-password.ctr.dto';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { API_V1_AUTH } from '../constants';

@Controller(API_V1_AUTH)
export class ResetPasswordController {
  constructor(private readonly useCase: ResetPasswordUseCase) {}

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() { token, newPassword }: ResetPasswordDto,
    @Res() res: Response,
  ) {
    await this.useCase.execute({
      token,
      newPassword,
    });

    const response = ApiResponseFactory.success({
      message: 'Password has been reset successfully',
    });

    res.status(HttpStatus.OK).json(response);
  }
}
