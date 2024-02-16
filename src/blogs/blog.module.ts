import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/entities/blog';
import { Topic } from 'src/entities/topic';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Topic, User])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
