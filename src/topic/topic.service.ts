import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Topic } from "src/entities/topic";
import { Repository } from "typeorm";
import { Request } from "express";
import { User } from "src/entities/user";
import { CreateTopicDto } from "./dtos/create-topic.dto";
import { UpdateTopicDto } from "./dtos/update-topic.dto";


@Injectable() 
export class TopicService {

    constructor(
        @InjectRepository(Topic) private topicRepository: Repository<Topic>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {};

    async createTopic(createTopicDto: CreateTopicDto, req: Request) {
        try {

            const username = req.user['username'];

            const loggedInUser = await this.userRepository.findOne({ where: { username } })

            const roleOfLoggedInUser = loggedInUser.roleId;

            if (!(roleOfLoggedInUser === 1 || roleOfLoggedInUser === 2)) {
                throw new UnauthorizedException('Not authorized to create topics.')
            }

            const newTopic = new Topic();
            newTopic.userId = loggedInUser.userId;
            newTopic.name = createTopicDto.name;
            newTopic.desc = createTopicDto.desc;

            const savedTopic = await this.topicRepository.save(newTopic);
            const { topicId, userId, ...topicDetails } = savedTopic;

            return topicDetails;
            
        } catch (error) {
            
            throw new Error(error);

        }
    }

    // async updateTopic(updateTopicDto: UpdateTopicDto, req: Request) {

    //   try {

    //     const username = req.user['username'];
    //     const loggedInUser = await this.userRepository.findOne({ where: { username } })

    //     const topicToBeUpdated = await this.topicRepository.findOne({ where: { name: updateTopicDto.name, userId: loggedInUser.userId } })

    //     if (!topicToBeUpdated) {
    //         throw new UnauthorizedException('Not authorized or topic not found.')
    //     }
        
    //   } catch (error) {
        
    //     throw new Error(error); 

    //   }

    // }
}