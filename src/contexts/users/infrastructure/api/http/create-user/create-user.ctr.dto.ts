import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserControllerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: string;

  @IsUUID('4')
  @IsNotEmpty()
  authId: string;
}
