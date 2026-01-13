import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { API_V1_USERS } from '../constants';
import { CreateUserUseCase } from 'src/contexts/users/application/create-user/create-user.application';
import { CreateUserControllerDto } from './create-user.ctr.dto';
import { ApiResponseFactory } from 'src/shared/contexts/http/api-response.factory';

@Controller(API_V1_USERS)
export class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async run(
    @Body() body: CreateUserControllerDto,
    @Res() res: Response,
  ): Promise<void> {
    const newUser = await this.useCase.execute({
      firstname: body.firstname,
      lastname: body.lastname,
      username: body.username,
      birthday: new Date(body.birthday),
      authId: body.authId,
    });

    const response = ApiResponseFactory.success(newUser);
    res.status(HttpStatus.CREATED).json(response);
  }
}
