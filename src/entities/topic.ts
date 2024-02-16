import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import * as md5 from 'md5';
import { UUID } from "crypto";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { Editor } from "./editor";
import { Blog } from "./blog";

@Entity() 
export class Topic {
    @PrimaryColumn('uuid') 
    topicId: string;

    @Column()
    userId: string;

    @Column({ unique: true })
    name: string;

    @Column()
    desc: string;

    // @ManyToMany(() => Editor, editor => editor.)
    // @JoinColumn()
    // editor: Editor;

    @OneToMany(() => Blog, blog => blog.topic) 
    @JoinColumn()
    blog: Blog;

    

}