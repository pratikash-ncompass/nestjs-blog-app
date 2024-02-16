import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TopicController } from "./topic.controller";
import { TopicService } from "./topic.service";
import { Topic } from "src/entities/topic";
import { User } from "src/entities/user";
import { Editor } from "src/entities/editor";
import { Viewer } from "src/entities/viewer";


@Module({
    imports: [TypeOrmModule.forFeature([Topic, User, Editor, Viewer])],
    controllers: [TopicController],
    providers: [TopicService],
})
export class TopicModule {}
