import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
// import { Role } from "./role";
import { Editor } from "./editor";
import { Viewer } from "./viewer";
import * as md5 from 'md5';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  emailId: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
      this.password = md5(this.password);
  }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 4 })
  roleId: number;

  @OneToOne(() => Editor, (editor) => editor.user)
  @JoinColumn()
  editor: Editor;

  @OneToOne(() => Viewer, (viewer) => viewer.user)
  @JoinColumn()
  viewer: Viewer;
}
