import { IsAlphanumeric, IsNegative, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginUserDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    username: string;

    @IsString()
    @Length(5, 100, { message: 'Password must be atleast 5 characters.' })
    password: string;
}
