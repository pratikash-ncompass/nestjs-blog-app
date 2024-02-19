import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { CustomApiResponse } from 'src/utils/send-response';
import { AssignTopicDto } from './dtos/assign-topic.dto';

@Controller('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTopic(
    @Body() createTopicDto: CreateTopicDto,
    @Req() req: Request,
  ) {
    const createdTopic = await this.topicService.createTopic(
      createTopicDto,
      req,
    );
    return new CustomApiResponse(
      200,
      'Topic Created Sucessfully',
      createdTopic,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('assign-topic')
  async assignTopic(
    @Body() assignTopicDto: AssignTopicDto,
    @Req() req: Request,
  ) {
    const username = req.user['username'];

    const data = await this.topicService.assignTopic(username, assignTopicDto);
    return new CustomApiResponse(200, 'Topic Assigned Successfully', data);
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

  @UseGuards(JwtAuthGuard)
  @Patch('deassign-topic')
  async deassignTopic(
    @Body() deassignTopicDto: AssignTopicDto,
    @Req() req: Request,
  ) {
    const username = req.user['username'];

    const data = await this.topicService.deassignTopic(
      username,
      deassignTopicDto,
    );
    return new CustomApiResponse(200, 'Topic succesfully deassigned.', data);
  }
}
