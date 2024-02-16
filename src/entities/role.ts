import { Column, Entity, OneToMany, PrimaryColumn} from "typeorm";

@Entity() 
export class Role {
    @PrimaryColumn()
    roleId: number;

    @Column()
    roleName: string;
}