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
import { API_V1_AUTH } from '../constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';

@ApiTags('Authentication')
@Controller(API_V1_AUTH)
export class ResetPasswordController {
  constructor(private readonly useCase: ResetPasswordUseCase) {}

  @Post('reset-password')
  @ApiOperation({
    summary: 'Update forgotten password',
    description: 'Updates the user password using a valid recovery token.',
  })
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
