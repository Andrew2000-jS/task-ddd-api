import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { FindAllUsersUseCase } from 'src/contexts/users/application/find-all-user/find-all-user.application';
import { API_V1_USERS } from '../constants';
import { QueryAllCtrDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_USERS)
@UseGuards(AuthGuard)
export class FindAllUsersController {
  constructor(private readonly useCase: FindAllUsersUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async run(
    @Query() { limit, offset }: QueryAllCtrDto,
    @Res() res: Response,
  ): Promise<void> {
    const users = await this.useCase.execute({ limit, offset });

    const response = ApiResponseFactory.success(users);
    res.status(HttpStatus.OK).json(response);
  }
}
