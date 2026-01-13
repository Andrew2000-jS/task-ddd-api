import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { RecoveryPasswordDto } from './recovery-password.ctr.dto';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { API_V1_AUTH } from '../constants';
import { RecoveryPasswordUseCase } from 'src/contexts/auth/application/recovery-password/recovery-password.application';

@Controller(API_V1_AUTH)
export class RecoveryPasswordController {
  constructor(private readonly useCase: RecoveryPasswordUseCase) {}

  @Post('recovery-password')
  @HttpCode(HttpStatus.OK)
  async handle(@Body() { email }: RecoveryPasswordDto, @Res() res: Response) {
    await this.useCase.execute(email);

    const response = ApiResponseFactory.success({
      message: 'If the email exists, a recovery token has been generated',
    });

    res.status(HttpStatus.OK).json(response);
  }
}
