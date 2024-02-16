import { IsString, Length } from "class-validator";

export class CreateTopicDto {

    @Length(3, 50, { message: 'Topic name must be between 3 and 50 characters.' })
    name: string;

    @IsString()
    desc: string;

}