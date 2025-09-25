import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: string;
}
