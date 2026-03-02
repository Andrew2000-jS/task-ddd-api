import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { FindOneUserUseCase } from 'src/contexts/users/application/find-one-user/find-one-user.application';
import { API_V1_USERS } from '../constants';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/contexts/infrastructure/decorators/get-user.decorator';

@ApiTags('User')
@Controller(API_V1_USERS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class FindOneUserController {
  constructor(private readonly useCase: FindOneUserUseCase) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async run(@GetUser('sub') id: string, @Res() res: Response): Promise<void> {
    const user = await this.useCase.execute(id);
    const response = ApiResponseFactory.success(user);
    res.status(HttpStatus.OK).json(response);
  }
}
