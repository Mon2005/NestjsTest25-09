import { IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class QueryUserDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  offset?: number = 0;

  @IsOptional()
  limit?: number = 10;
}
