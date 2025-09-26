import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <- bắt buộc để load .env
    MongooseModule.forRoot(process.env.MONGODB_URI!), // ! để chắc chắn không undefined
    UsersModule,
    AuthModule,
    TodosModule,
  ],
})
export class AppModule {}
