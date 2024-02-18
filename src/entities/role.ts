import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity() 
export class Role {
    @PrimaryGeneratedColumn()
    roleId: number;

    @Column({ unique: true })
    roleName: string
}