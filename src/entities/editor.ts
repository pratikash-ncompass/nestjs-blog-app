import { Column, Entity, OneToMany, OneToOne, PrimaryColumn} from "typeorm";
import * as md5 from 'md5';
import { UUID } from "crypto";
import { User } from "./user";

@Entity() 
export class Editor {
    @OneToOne(() => User, user => user.editor)
    user: User;

    @PrimaryColumn('uuid')
    userId: string;

    @PrimaryColumn('uuid')
    topicId: string;
}