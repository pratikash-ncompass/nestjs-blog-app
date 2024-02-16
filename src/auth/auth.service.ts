import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { error } from 'console';
import { AssignTopicDto } from './dtos/assign-topic.dto';
import { Topic } from 'src/entities/topic';
import { Editor } from 'src/entities/editor';
import { Viewer } from 'src/entities/viewer';
import { Role } from 'src/entities/role';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    @InjectRepository(Editor) private editorRepository: Repository<Editor>,
    @InjectRepository(Viewer) private viewerRepository: Repository<Viewer>,
    private jwtService: JwtService
    ) {};

  async validateUser(username: string, password: string) {

    try {
      
      const hashedUserPassword = md5(password);
      const user = await this.userRepository.findOne({ where: { username, password: hashedUserPassword } });
      if(!user) {
          throw new UnauthorizedException('Unauthorized access.');
      }
      return user;

    } catch (error) {
      
      throw new Error(error);

    }
  }

  async loginTokenGeneration(loginUserDto: LoginUserDto) {
    try {
            
      const payload = { username: loginUserDto.username };
      const accessToken = this.jwtService.sign(payload);
          
      return accessToken;

  } catch (error) {
      
      throw new Error(error);

  }
  }

  async userDetails(username: string) {
    return await this.userRepository.findOne({ where: { username }});
  }

  async assignRoles(username: string, updateRoleDto: UpdateRoleDto) {
    try {
      
      const superadminAssignableRoles = [2, 3, 4];
      const adminAssignableRoles = [3, 4];

      const fetchedUser = await this.userRepository.findOne({ where : { username: updateRoleDto.username }});
      const changingRoleUser = await this.userRepository.findOne({ where : { username }});
      const fetchedUserRoleId = fetchedUser.roleId;
      const toBeChangedRole = updateRoleDto.roleId;   

      if (!(changingRoleUser.roleId === 1 || changingRoleUser.roleId === 2)) {
        throw new UnauthorizedException(`You don't have the authority to assign roles`)
      }
      
      if (changingRoleUser.userId === fetchedUser.userId) {
        throw new UnauthorizedException('Cannot Change Your Own Role');
      }

      if (!(superadminAssignableRoles.includes(toBeChangedRole))) {
        throw new BadRequestException('Invalid Role');
      }
  
      if (!(changingRoleUser.roleId === 1 && superadminAssignableRoles.includes(toBeChangedRole)) && !(changingRoleUser.roleId === 2 && adminAssignableRoles.includes(toBeChangedRole))) {
        throw new UnauthorizedException('You are not Authorized to change the particular role');
      }
      fetchedUser.roleId = updateRoleDto.roleId;
  
      await this.userRepository.save(fetchedUser);
      return {previousRole: fetchedUserRoleId, currentRole: fetchedUser.roleId};
    } catch (error) {
      throw new Error(error);
    }
  }

  async checkUserRoles(username: string) {
    const loggedInUser = await this.userRepository.findOne({ where : { username }});
    const userRole = loggedInUser.roleId;

    if (!(userRole === 1 || userRole === 2)) {
      throw new UnauthorizedException(`You cannot check other's roles`);
    }

    const userData = await this.userRepository
    .createQueryBuilder('user')
    .select(['user.username', 'user.roleId'])
    .getMany();

    return userData;
  }

  async assignTopic(username: string, assignTopicDto: AssignTopicDto) {
    const loggedInUser = await this.userRepository.findOne({ where : { username }});
    const fetchedUser = await this.userRepository.findOne({ where : { username: assignTopicDto.username }});
    const userRole = loggedInUser.roleId;
    const fetchedUserRoleId = fetchedUser.roleId;    

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
    return assignTopicDto;
  }
}
