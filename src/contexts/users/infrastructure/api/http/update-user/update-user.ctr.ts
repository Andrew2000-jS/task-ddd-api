import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UpdateUserBodyDto } from './update-user.ctr.dto';
import { UpdateUserUseCase } from 'src/contexts/users/application/update-user/update-user.application';
import { API_V1_USERS } from '../constants';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { ApiResponseFactory } from 'src/shared/contexts/infrastructure/http/api-response.factory';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/contexts/infrastructure/decorators/get-user.decorator';

@ApiTags('User')
@Controller(API_V1_USERS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class UpdateUserController {
  constructor(private readonly useCase: UpdateUserUseCase) {}

  @Patch()
  @ApiOperation({
    summary: 'Update account info',
    description:
      'Updates the profile information of the currently authenticated user.',
  })
  @HttpCode(HttpStatus.OK)
  async run(
    @GetUser('sub') id: string,
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
