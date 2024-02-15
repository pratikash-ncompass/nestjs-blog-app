import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { Topic } from "./topic";

@Entity() 
export class Blog {
    @ManyToOne(() => Topic, topic => topic.blog)
    topic: Topic;

    @PrimaryColumn('uuid') 
    blogId: string;

    @Column()
    topicId: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column()
    desc: string;

    @Column()
    header: string;

    @Column()
    body: string;

    @Column()
    footer: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}