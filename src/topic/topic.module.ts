import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
