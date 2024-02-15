import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
// import { Role } from "./role";
import { Editor } from "./editor";
import { Viewer } from "./viewer";

@Entity({ name: 'users' }) 
export class User {
    @PrimaryGeneratedColumn('uuid') 
    userId: number;

    @Column({ unique: true })
    emailId: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: 3 })
    roleId: number;

    @OneToOne(() => Editor, editor => editor.user)
    @JoinColumn()
    editor: Editor;

    @OneToOne(() => Viewer, viewer => viewer.user)
    @JoinColumn()
    viewer: Viewer;
}