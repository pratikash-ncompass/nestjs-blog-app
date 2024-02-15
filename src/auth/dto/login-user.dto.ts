import { IsAlphanumeric, IsNegative, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
