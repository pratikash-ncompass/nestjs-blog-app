import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AssignTopicDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    topicName: string;
}