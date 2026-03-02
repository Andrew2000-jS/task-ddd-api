import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class FindOneTaskQueryDto {
  @ApiPropertyOptional({
    description: 'The URL-friendly identifier of the task',
    example: 'finish-ddd-documentation',
  })
  @IsString()
  @IsOptional()
  slug?: string;
}
