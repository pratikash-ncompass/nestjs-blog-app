import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    @Length(6, 25, { message: 'Username must be between 6 and 25 characters.' })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    emailId: string;

    @IsNotEmpty()
    @Length(6, 25, { message: 'Password must be between 6 and 25 characters.' })
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;
}
