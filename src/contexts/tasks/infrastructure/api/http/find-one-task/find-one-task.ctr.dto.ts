import { IsString, IsOptional } from 'class-validator';

export class FindOneTaskQueryDto {
  @IsString()
  @IsOptional()
  slug?: string;
}
