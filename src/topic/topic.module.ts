import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TopicController } from "./topic.controller";
import { TopicService } from "./topic.service";
import { Topic } from "src/entities/topic";
import { User } from "src/entities/user";
import { PermissionTable } from "src/entities/permission";


@Module({
    imports: [TypeOrmModule.forFeature([Topic, User, PermissionTable])],
    controllers: [TopicController],
    providers: [TopicService],
})
export class TopicModule {}
