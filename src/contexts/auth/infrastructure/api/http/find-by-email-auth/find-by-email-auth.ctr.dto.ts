import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindByEmailAuthDto {
  @IsEmail({}, { message: 'The provided email is not valid' })
  @IsNotEmpty()
  email: string;
}
