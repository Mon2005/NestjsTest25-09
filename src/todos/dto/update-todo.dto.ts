import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsOptional, IsIn } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: string;
}
