import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { LoginUseCase } from 'src/contexts/auth/application/login/login.application';
import { LoginDto } from './login.ctr.dto';
import { API_V1_AUTH } from '../constants';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';

@ApiTags('Authentication')
@Controller(API_V1_AUTH)
export class LoginController {
  constructor(private readonly useCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handle(@Body() data: LoginDto, @Res() res: Response) {
    const result = await this.useCase.execute(data);

    const response = ApiResponseFactory.success({
      message: 'Login successfully',
      data: result,
    });

    res.status(HttpStatus.OK).json(response);
  }
}
