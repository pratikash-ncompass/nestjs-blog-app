import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, PrimaryColumn} from "typeorm";
import { v4 as uuidv4 } from 'uuid'
import { Blog } from "./blog";

@Entity() 
export class Topic {
    @PrimaryColumn('uuid') 
    topicId: string;

    @BeforeInsert() 
    beforeInsertFunc() {
        this.topicId = uuidv4();
    }

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