import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user';import {v4 as uuidv4} from 'uuid';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectRepository(Role) private roleRepository: Repository<Role>
    ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.userId = uuidv4();
    newUser.username = createUserDto.username;
    newUser.emailId = createUserDto.emailId;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.password = createUserDto.password;
    
    await this.userRepository.save(newUser)    
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
