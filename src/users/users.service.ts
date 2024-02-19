import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as md5 from 'md5';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/entities/user';
import { Role } from 'src/entities/role';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = md5(createUserDto.password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { password, userId, roleId, ...userDetails } = savedUser;
    const roleName = (await this.roleRepository.findOne({ where: { roleId } }))
      .roleName;

    const fetchedDetails = { ...userDetails, roleName };
    return fetchedDetails;
  }

  // async findUserById(id: string) {
  //   const user = await this.userRepository.findOne({ where: { userId: id } });
  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }
  //   return user;
  // }

  async userDetails(username: string) {
    const fetchedUser = await this.userRepository.findOne({
      where: { username },
    });
    const { userId, password, roleId, ...userDetails } = fetchedUser;
    const fetchedUserRoleName = await this.roleRepository.findOne({
      where: { roleId },
    });
    const roleName = fetchedUserRoleName.roleName;

    const fetchedDetails = { ...userDetails, roleName };
    return fetchedDetails;
  }
}
