import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user';
import * as md5 from 'md5';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {

      const hashedPassword = md5(createUserDto.password);    
      const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
  
      const savedUser = await this.userRepository.save(newUser);
      const { password, userId, ...userDetails } = savedUser;

      return userDetails;
      
    } catch (error) {
      
      throw new Error(error)

    }

  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
