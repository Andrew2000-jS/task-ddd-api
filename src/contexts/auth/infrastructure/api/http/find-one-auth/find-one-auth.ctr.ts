import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FindOneAuthUseCase } from 'src/contexts/auth/application/find-one-auth/find-one-auth.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { API_V1_AUTH } from '../constants';
import { ParamDto } from 'src/shared/contexts/types/query.dto';

@Controller(API_V1_AUTH)
export class FindOneAuthController {
  constructor(private readonly useCase: FindOneAuthUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async handle(@Param() { id }: ParamDto, @Res() res: Response) {
    const result = await this.useCase.execute(id);

    const response = ApiResponseFactory.success({
      message: 'Authentication record retrieved successfully',
      data: result,
    });

    res.status(HttpStatus.OK).json(response);
  }
}
