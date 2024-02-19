import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import { Blog } from "./blog";

@Entity() 
export class Topic {
    @PrimaryGeneratedColumn('uuid') 
    topicId: string;

    // @BeforeInsert() 
    // beforeInsertFunc() {
    //     this.topicId = uuidv4();
    // }

    @Column()
    userId: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true, type: 'text' })
    desc: string;

    // @ManyToMany(() => Editor, editor => editor.)
    // @JoinColumn()
    // editor: Editor;

    @OneToMany(() => Blog, blog => blog.topic) 
    @JoinColumn()
    blog: Blog;
    
}