import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Topic } from './entities/topic';
import { Blog } from './entities/blog';
import { Editor } from './entities/editor';
import { Viewer } from './entities/viewer';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './utils/error-handler';
import { APP_FILTER } from '@nestjs/core';
import { BlogModule } from './blogs/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Topic, Blog, Editor, Viewer],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService, {provide:APP_FILTER, useClass: GlobalExceptionFilter}],
})
export class AppModule {}
