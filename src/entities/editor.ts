import { Entity, OneToOne, PrimaryColumn} from "typeorm";
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