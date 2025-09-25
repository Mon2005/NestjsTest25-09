import { Type } from 'class-transformer';
import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class QueryTodoDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0;
}
