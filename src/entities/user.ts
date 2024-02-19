import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 4 })
  roleId: number;

  // @ManyToOne(() => Role, role => role.roleId)
  // role: Role;

  // @OneToOne(() => Editor, (editor) => editor.user)
  // @JoinColumn()
  // editor: Editor;

  // @OneToOne(() => Viewer, (viewer) => viewer.user)
  // @JoinColumn()
  // viewer: Viewer;
}
