import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/entities/user';
import { Blog } from 'src/entities/blog';
import { Topic } from 'src/entities/topic';
import { PermissionTable } from 'src/entities/permission';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Topic, User, PermissionTable])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
