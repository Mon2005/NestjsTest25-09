import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(userId: string, dto: CreateTodoDto): Promise<Todo> {
    const todo = new this.todoModel({ ...dto, user: userId });
    return todo.save();
  }

  async findAll(userId: string, query: QueryTodoDto) {
    const { search, status, offset = 0, limit = 10 } = query;
    const filter: any = { user: userId };

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (status) filter.status = status;

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
        meta: { limit, offset, total, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async findOne(userId: string, id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid ID format');

    const todo = await this.todoModel.findOne({ _id: id, user: userId }).exec();
    if (!todo) throw new NotFoundException(`Todo ${id} not found or not yours`);

    return { statusCode: 200, data: todo };
  }

  async update(userId: string, id: string, dto: UpdateTodoDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid ID format');

    const todo = await this.todoModel
      .findOneAndUpdate({ _id: id, user: userId }, dto, { new: true })
      .exec();

    if (!todo) throw new NotFoundException(`Todo ${id} not found or not yours`);
    return todo;
  }

  async remove(userId: string, id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid ID format');

    const result = await this.todoModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();
    if (!result)
      throw new NotFoundException(`Todo ${id} not found or not yours`);

    return { statusCode: 200, message: 'Todo deleted successfully' };
  }
}
