import { IsAlphanumeric, IsNegative, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class UpdateRoleDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    username: string;

    @IsNumber()
    @IsNotEmpty()
    roleId: number;
}
