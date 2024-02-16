import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user';
import { v4 as uuidv4 } from 'uuid';

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

    await this.userRepository.save(newUser);
    console.log(newUser);

    return newUser;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // async isAdmin(userId: number): Promise<boolean> {
  //   const user = await this.userRepository.findOne(userId);

  //   if (!user) {
  //     throw new NotFoundException(`User with id ${userId} not found`);
  //   }

  //   // Check if the user has admin role
  //   return user.isAdmin === true;
  // }
}
