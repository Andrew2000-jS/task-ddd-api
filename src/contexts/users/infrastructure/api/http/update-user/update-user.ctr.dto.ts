import {
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstname?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastname?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}
