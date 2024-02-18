import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity() 
export class Role {
    @PrimaryGeneratedColumn()
    roleId: number;

    @Column({ unique: true })
    roleName: string
}