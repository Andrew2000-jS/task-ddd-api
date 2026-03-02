import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateTaskControllerDto {
  @ApiPropertyOptional({
    description: 'The updated title of the task',
    example: 'Updated Task Title',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: 'The updated URL-friendly slug',
    example: 'updated-task-title',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'The updated detailed description',
    example: 'This is the new description of the task.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The updated completion status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
