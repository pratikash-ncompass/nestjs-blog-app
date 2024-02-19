import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

import { Topic } from "./topic";

@Entity() 
export class Blog {
    @ManyToOne(() => Topic, topic => topic.blog)
    topic: Topic;

    @PrimaryGeneratedColumn('uuid') 
    blogId: string;

    // @BeforeInsert() 
    // beforeInsertFunc() {
    //     this.blogId = uuidv4();
    // }

    @Column()
    topicId: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column({ type: 'text' })
    desc: string;

    @Column()
    header: string;

    @Column({ type: 'text' })
    body: string;

    @Column()
    footer: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}