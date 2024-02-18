import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/entities/user';
import { Editor } from 'src/entities/editor';

@Module({
  imports: [TypeOrmModule.forFeature([User, Editor])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
