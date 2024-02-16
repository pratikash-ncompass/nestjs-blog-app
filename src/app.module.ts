import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Topic } from './entities/topic';
import { Blog } from './entities/blog';
import { Editor } from './entities/editor';
import { Viewer } from './entities/viewer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './utils/error-handler';
import { APP_FILTER } from '@nestjs/core';
import { TopicModule } from './topic/topic.module';
import { ConfigDatabaseModule } from './config/config.module';
import { databaseConfig } from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigDatabaseModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }), 
    UsersModule,
    AuthModule,
    TopicModule
  ],
  controllers: [AppController],
  providers: [AppService, {provide:APP_FILTER, useClass: GlobalExceptionFilter}],
})
export class AppModule {}
