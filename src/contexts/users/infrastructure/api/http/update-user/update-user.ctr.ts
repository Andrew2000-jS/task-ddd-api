import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UpdateUserBodyDto } from './update-user.ctr.dto';
import { UpdateUserUseCase } from 'src/contexts/users/application/update-user/update-user.application';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';
import { API_V1_USERS } from '../constants';
import { ParamDto } from 'src/shared/contexts/types/query.dto';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';

@Controller(API_V1_USERS)
@UseGuards(AuthGuard)
export class UpdateUserController {
  constructor(private readonly useCase: UpdateUserUseCase) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async run(
    @Param() { id }: ParamDto,
    @Body() body: UpdateUserBodyDto,
    @Res() res: Response,
  ): Promise<void> {
    const birthday = body.birthday ? new Date(body.birthday) : undefined;
    await this.useCase.execute(id, {
      ...body,
      birthday,
    });

    const response = ApiResponseFactory.success({
      message: 'User Updated successfully',
    });

    res.status(HttpStatus.OK).json(response);
  }
}
