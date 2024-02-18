import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";

import { Topic } from "src/entities/topic";
import { User } from "src/entities/user";
import { CreateTopicDto } from "./dtos/create-topic.dto";
import { Editor } from "src/entities/editor";
import { AssignTopicDto } from "./dtos/assign-topic.dto";
import { Viewer } from "src/entities/viewer";


@Injectable() 
export class TopicService {

    constructor(
        @InjectRepository(Topic) private topicRepository: Repository<Topic>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Editor) private editorRepository: Repository<Editor>,
        @InjectRepository(Viewer) private viewerRepository: Repository<Viewer>,
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

    async assignTopic(username: string, assignTopicDto: AssignTopicDto) {
        const loggedInUser = await this.userRepository.findOne({ where : { username }});
        const fetchedUser = await this.userRepository.findOne({ where : { username: assignTopicDto.username }});
        const userRole = loggedInUser.roleId;
        const fetchedUserRoleId = fetchedUser.roleId;
        console.log(fetchedUser);
        
    
        if (!(userRole === 1 || userRole === 2)) {
          throw new UnauthorizedException(`You don't have authrization to assign topics`);
        }
    
        let fetchedUserTopicId = await this.topicRepository.findOne({ where: {name: assignTopicDto.topicName} });
        if (fetchedUserRoleId === 3) {
          const newEditor = new Editor();
          newEditor.topicId = fetchedUserTopicId.topicId;
          newEditor.userId = fetchedUser.userId;
          await this.editorRepository.save(newEditor);
    
          const newViewer = new Viewer();
          newViewer.topicId = fetchedUserTopicId.topicId;
          newViewer.userId = fetchedUser.userId;
          await this.viewerRepository.save(newViewer);
        }
        if (fetchedUserRoleId === 4) {
          const newViewer = new Viewer();
          newViewer.topicId = fetchedUserTopicId.topicId;
          newViewer.userId = fetchedUser.userId;
          await this.viewerRepository.save(newViewer);
        }
    
      }
}