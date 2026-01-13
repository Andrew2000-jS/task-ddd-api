import { IsString, IsOptional, IsUUID } from 'class-validator';

export class FindOneUserControllerDto {
  @IsString()
  @IsOptional()
  username?: string;
}
