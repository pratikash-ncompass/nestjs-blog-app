import { Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import { User } from "./user";

@Entity() 
export class Viewer {
    @OneToOne(() => User, user => user.viewer)
    user: User;

    @PrimaryColumn('uuid')
    userId: string;

    @PrimaryColumn('uuid')
    topicId: string;
}