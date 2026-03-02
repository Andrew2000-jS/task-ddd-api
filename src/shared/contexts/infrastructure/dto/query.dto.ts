import {
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ParamDto {
  @ApiProperty({
    description: 'The unique identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655443001',
    format: 'uuid',
  })
  @IsUUID('4')
  id: string;
}

export class UserPayloadDto {
  @IsNotEmpty()
  @IsUUID()
  sub: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class QueryAllCtrDto {
  @ApiPropertyOptional({
    description: 'Number of records to return per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of records to skip',
    minimum: 0,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
