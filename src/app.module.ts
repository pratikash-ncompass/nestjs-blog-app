import { Module} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './utils/error-handler';
import { BlogModule } from './blogs/blog.module';
import { TopicModule } from './topic/topic.module';
import { ConfigDatabaseModule } from './config/config.module';
import { databaseConfig } from './config/db.config';
import { RoleModule } from './role/role.module';

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
    BlogModule,
    TopicModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, {provide:APP_FILTER, useClass: GlobalExceptionFilter}],
})
export class AppModule {};
