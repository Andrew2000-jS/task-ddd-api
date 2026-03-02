import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoveryPasswordDto {
  @ApiProperty({
    description: 'The email address associated with the account',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'The provided email is not valid' })
  @IsNotEmpty()
  email: string;
}
