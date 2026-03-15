import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateAuthDto } from './create-auth.ctr.dto';
import { CreateAuthUseCase } from 'src/contexts/auth/application/create-auth/create-auth.application';
import { API_V1_AUTH } from '../constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';

@ApiTags('Authentication')
@Controller(API_V1_AUTH)
export class CreateAuthController {
  constructor(private readonly useCase: CreateAuthUseCase) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account in the system and initializes default settings.',
  })
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() data: CreateAuthDto, @Res() res: Response) {
    const result = await this.useCase.execute(data);
    const response = ApiResponseFactory.success({
      message: 'Authentication record created successfully',
      data: result,
    });
    res.status(HttpStatus.CREATED).json(response);
  }
}
