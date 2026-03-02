import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateTaskControllerDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Finish DDD Documentation',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'URL-friendly version of the title',
    example: 'finish-ddd-documentation',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    description: 'Detailed explanation of the task',
    example:
      'Complete the Swagger documentation for the Task module using best practices.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The current status of the task',
    example: false,
    default: false,
  })
  @IsBoolean()
  isCompleted: boolean;
}
