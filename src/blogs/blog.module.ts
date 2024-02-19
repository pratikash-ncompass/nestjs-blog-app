import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/entities/blog';
import { Topic } from 'src/entities/topic';
import { PermissionTable } from 'src/entities/permission';
import { TopicService } from 'src/topic/topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Topic, User, PermissionTable])],
  controllers: [BlogController],
  providers: [BlogService, TopicService],
})
export class BlogModule {}
