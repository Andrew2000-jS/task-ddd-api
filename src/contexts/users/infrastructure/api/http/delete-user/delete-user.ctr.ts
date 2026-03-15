import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { API_V1_USERS } from '../constants';
import { DeleteUserUseCase } from 'src/contexts/users/application/delete-user/delete-user.application';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/contexts/infrastructure/decorators/get-user.decorator';

@ApiTags('User')
@Controller(API_V1_USERS)
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard)
export class DeleteUserController {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Close account',
    description:
      'Deletes the account of the current user and removes all associated data.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async run(@GetUser('sub') id: string, @Res() res: Response): Promise<void> {
    await this.useCase.execute(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
