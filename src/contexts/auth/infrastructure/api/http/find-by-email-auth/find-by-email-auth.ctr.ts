import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FindByEmailAuthDto } from './find-by-email-auth.ctr.dto';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { API_V1_AUTH } from '../constants';
import type { Response } from 'express';
import { FindByEmailAuthUseCase } from 'src/contexts/auth/application/find-by-email-auth/find-by-email.application';

@Controller(API_V1_AUTH)
export class FindByEmailAuthController {
  constructor(private readonly useCase: FindByEmailAuthUseCase) {}

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async handle(@Query() { email }: FindByEmailAuthDto, @Res() res: Response) {
    const result = await this.useCase.execute(email);

    const response = ApiResponseFactory.success({
      message: 'Authentication record retrieved successfully',
      data: result,
    });

    res.status(HttpStatus.OK).json(response);
  }
}
