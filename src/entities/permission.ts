import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { User } from "./user";
import { Topic } from "./topic";

@Entity()
export class PermissionTable {
    @ManyToOne(() => User, user => user.userId)
    user: User;

    @ManyToOne(() => Topic, topic => topic.topicId)
    topic: Topic;

    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    topicId: string;

    @Column('boolean')
    isEditor: boolean;

    @Column('boolean')
    isViewer: boolean;

}