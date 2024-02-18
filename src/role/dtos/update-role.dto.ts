import { IsAlphanumeric, IsNegative, IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateRoleDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    roleName: string;
}
