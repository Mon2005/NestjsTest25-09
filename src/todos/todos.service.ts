import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = new this.todoModel(createTodoDto);
    return todo.save();
  }

  async findAll(query: QueryTodoDto) {
    const { keyword, status, limit = 10, offset = 0 } = query;

    const filter: any = {};
    if (keyword) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (status) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      filter.status = status;
    }

    const [items, total] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.todoModel.find(filter).skip(offset).limit(limit).exec(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.todoModel.countDocuments(filter),
    ]);

    return {
      statusCode: 200,
      data: {
        items,
        meta: {
          limit,
          offset,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoModel
      .findByIdAndUpdate(
        id,
        { ...updateTodoDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  async remove(id: string): Promise<{ statusCode: number; message: string }> {
    const result = await this.todoModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Todo ${id} not found`);

    return {
      statusCode: 200,
      message: 'Todo deleted successfully',
    };
  }
}
