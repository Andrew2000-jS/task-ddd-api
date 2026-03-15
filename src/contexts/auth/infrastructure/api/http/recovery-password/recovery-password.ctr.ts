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
import { API_V1_AUTH } from '../constants';
import { RecoveryPasswordUseCase } from 'src/contexts/auth/application/recovery-password/recovery-password.application';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';

@ApiTags('Authentication')
@Controller(API_V1_AUTH)
export class RecoveryPasswordController {
  constructor(private readonly useCase: RecoveryPasswordUseCase) {}

  @Post('recovery-password')
  @ApiOperation({
    summary: 'Request password reset',
    description:
      "Sends a recovery email with a secure link or code to the user's registered address.",
  })
  @HttpCode(HttpStatus.OK)
  async handle(@Body() { email }: RecoveryPasswordDto, @Res() res: Response) {
    await this.useCase.execute(email);

    const response = ApiResponseFactory.success({
      message: 'If the email exists, a recovery token has been generated',
    });

    res.status(HttpStatus.OK).json(response);
  }
}
