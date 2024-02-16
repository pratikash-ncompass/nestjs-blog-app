import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/entities/blog';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class UsersModule {}
