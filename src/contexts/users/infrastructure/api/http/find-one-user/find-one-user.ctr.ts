import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { FindOneUserControllerDto } from './find-one-user.ctr.dto';
import { FindOneUserUseCase } from 'src/contexts/users/application/find-one-user/find-one-user.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { API_V1_USERS } from '../constants';
import { ParamDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_USERS)
@UseGuards(AuthGuard)
export class FindOneUserController {
  constructor(private readonly useCase: FindOneUserUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async run(
    @Param() { id }: ParamDto,
    @Query() { username }: FindOneUserControllerDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.useCase.execute({
      id,
      username,
    });

    const response = ApiResponseFactory.success(user);
    res.status(HttpStatus.OK).json(response);
  }
}
