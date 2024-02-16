import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dtos/create-topic.dto";
import { CustomApiResponse } from "src/utils/send-response";
import { UpdateTopicDto } from "./dtos/update-topic.dto";


@Controller('topic')
export class TopicController {

    constructor(private topicService: TopicService) {};

    @UseGuards(JwtAuthGuard)
    @Post() 
    async createTopic(@Body() createTopicDto: CreateTopicDto, @Req() req: Request) {
        try {

            const createdTopic = await this.topicService.createTopic(createTopicDto, req);
            console.log(createdTopic);
            return new CustomApiResponse(200, 'Topic succesfully created.', createdTopic);
            
        } catch (error) {
            throw new Error(error)
        }
    }

    // @UseGuards(JwtAuthGuard)
    // @Post() 
    // async updateTopic(@Body() updateTopicDto: UpdateTopicDto, @Req() req: Request, @Res() res: Response) {
    //     try {

    //         const updatedTopic = await this.topicService.updateTopic(updateTopicDto, req);
    //         return new CustomApiResponse(200, 'Topic succesfully created.', updatedTopic);
            
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // }
}