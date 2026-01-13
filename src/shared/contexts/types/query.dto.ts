import { IsUUID, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export interface QueryDTO {
  limit?: number;
  offset?: number;
}

export class ParamDto {
  @IsUUID('4')
  id: string;
}

export class QueryAllCtrDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
