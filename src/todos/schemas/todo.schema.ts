import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TodoStatus } from '../enums/todo-status.enum';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ enum: TodoStatus, default: TodoStatus.PENDING })
  status: TodoStatus;

  @Prop({ type: String, ref: 'User' })
  user: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// ✅ Export TodoStatus nếu muốn DTO import từ schema
export { TodoStatus };
