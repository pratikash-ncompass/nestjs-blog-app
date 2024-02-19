import {
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { Topic } from 'src/entities/topic';
import { User } from 'src/entities/user';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { AssignTopicDto } from './dtos/assign-topic.dto';
import { PermissionTable } from 'src/entities/permission';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PermissionTable)
    private permissonRepository: Repository<PermissionTable>,
  ) {}

  async findTopicId(topicName: string) {
    const topicId = await this.topicRepository.findOne({
      where: { name: topicName },
    });
    return topicId.topicId;
  }

  async createTopic(createTopicDto: CreateTopicDto, req: Request) {
    const username = req.user['username'];

    const loggedInUser = await this.userRepository.findOne({
      where: { username },
    });

    const roleOfLoggedInUser = loggedInUser.roleId;

    if (!(roleOfLoggedInUser === 1 || roleOfLoggedInUser === 2)) {
      throw new UnauthorizedException('Not authorized to create topics.');
    }

    const newTopic = new Topic();
    newTopic.userId = loggedInUser.userId;
    newTopic.name = createTopicDto.name;
    newTopic.desc = createTopicDto.desc;

    const savedTopic = await this.topicRepository.save(newTopic);

    const newPermission = new PermissionTable();
    newPermission.isEditor = true;
    newPermission.isViewer = true;
    newPermission.userId = newTopic.userId;
    newPermission.topicId = newTopic.topicId;
    newPermission.user = loggedInUser;
    newPermission.topic = savedTopic;
    await this.permissonRepository.save(newPermission);

    const { topicId, userId, ...topicDetails } = savedTopic;
    return topicDetails;
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
    const loggedInUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!(loggedInUser.roleId === 1 || loggedInUser.roleId === 2)) {
      throw new UnauthorizedException(
        `You don't have authorization to assign topics`,
      );
    }

    const userToAssignTopicTo = await this.userRepository.findOne({
      where: { username: assignTopicDto.username },
    });
    let topicToBeAssigned = await this.topicRepository.findOne({
      where: { name: assignTopicDto.topicName },
    });

    if (!userToAssignTopicTo || !topicToBeAssigned) {
      throw new NotFoundException('User or topic does not exist.');
    }

    const userToAssignTopicToRoleId = userToAssignTopicTo.roleId;
    // return console.log(userToAssignTopicToRoleId);

    let newPermission;
    if (userToAssignTopicToRoleId === 4 || userToAssignTopicToRoleId === 3) {
      newPermission = {
        user: userToAssignTopicTo,
        topic: topicToBeAssigned,
        userId: userToAssignTopicTo.userId,
        topicId: topicToBeAssigned.topicId,
        isEditor: userToAssignTopicToRoleId === 3,
        isViewer: true,
      };
    } else {
      throw new UnauthorizedException('Topic cannot be assigned to this');
    }

    const savedPermission = await this.permissonRepository.save(newPermission);

    const {
      userId: assignedPermissionToUserId1,
      topicId: topicId1,
      ...savedPermissionDetails
    } = savedPermission;

    const {
      userId: assignedPermissionToUserId12,
      password,
      ...savedPermissionDetailsForUser
    } = savedPermissionDetails.user;

    const {
      userId: topicUserId,
      topicId: topicId2,
      ...savedPermissionDetailsForTopic
    } = savedPermissionDetails.topic;

    const { roleId, ...savedDetails } = savedPermissionDetailsForUser;
    savedPermissionDetails.user = savedDetails;
    savedPermissionDetails.topic = savedPermissionDetailsForTopic;

    return savedPermissionDetails;

    // if (userToAssignTopicToRoleId === 3) {
    //   const newEditor = new Editor();
    //   newEditor.topicId = topicToBeAssigned.topicId;
    //   newEditor.userId = userToAssignTopicTo.userId;
    //   await this.editorRepository.save(newEditor);

    //   const newViewer = new Viewer();
    //   newViewer.topicId = topicToBeAssigned.topicId;
    //   newViewer.userId = userToAssignTopicTo.userId;
    //   await this.viewerRepository.save(newViewer);
    // }
    // if (userToAssignTopicToRoleId === 4) {
    //   const newViewer = new Viewer();
    //   newViewer.topicId = topicToBeAssigned.topicId;
    //   newViewer.userId = userToAssignTopicTo.userId;
    //   await this.viewerRepository.save(newViewer);
    // }
  }

  async deassignTopic(username: string, deassignTopicDto: AssignTopicDto) {
    const loggedInUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!(loggedInUser.roleId === 1 || loggedInUser.roleId === 2)) {
      throw new UnauthorizedException(
        `You don't have authorization to deassign topics`,
      );
    }

    const userToDeassignTopicTo = await this.userRepository.findOne({
      where: { username: deassignTopicDto.username },
    });
    const topicToBeDeassigned = await this.topicRepository.findOne({
      where: { name: deassignTopicDto.topicName },
    });

    if (!(userToDeassignTopicTo || topicToBeDeassigned)) {
      throw new NotFoundException(`User does not exist.`);
    }

    await this.permissonRepository.delete({
      userId: userToDeassignTopicTo.userId,
      topicId: topicToBeDeassigned.topicId,
    });

    const responseData = {
      username: loggedInUser.username,
      topicName: topicToBeDeassigned.name,
    };

    return responseData;
  }
}
