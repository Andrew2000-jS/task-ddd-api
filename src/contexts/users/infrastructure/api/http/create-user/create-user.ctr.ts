import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { API_V1_USERS } from '../constants';
import { CreateUserUseCase } from 'src/contexts/users/application/create-user/create-user.application';
import { CreateUserControllerDto } from './create-user.ctr.dto';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { GetUser } from 'src/shared/contexts/infrastructure/decorators/get-user.decorator';

@ApiTags('User')
@Controller(API_V1_USERS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Update account info',
    description:
      'Updates the profile information of the currently authenticated user.',
  })
  @HttpCode(HttpStatus.CREATED)
  async run(
    @GetUser('sub') authId: string,
    @Body() body: CreateUserControllerDto,
    @Res() res: Response,
  ): Promise<void> {
    const newUser = await this.useCase.execute({
      firstname: body.firstname,
      lastname: body.lastname,
      username: body.username,
      birthday: new Date(body.birthday),
      authId,
    });

    const response = ApiResponseFactory.success(newUser);
    res.status(HttpStatus.CREATED).json(response);
  }
}
