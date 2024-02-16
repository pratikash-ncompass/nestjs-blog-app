import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';
import { CustomError } from 'src/utils/custom-error';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const hashedPassword = md5(password);
    // console.log('helllllo');
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .andWhere('user.password = :password', { password: hashedPassword })
      .execute();
    // console.log(user);

    if (user && user.password === password) {
      const { password, ...userDetails } = user;
      return userDetails;
    }
    throw new NotFoundException('Not found token.');
  }

  async loginTokenGeneration(loginUserDto: LoginUserDto) {
    const payload = { username: loginUserDto.username };
    const accessToken = await this.jwtService.sign(payload);

    return accessToken;
  }

  async assignRolesToUsers(assignRoleDto: AssignRoleDto, @Req() req: Request) {
    // const adminUser = req.user;
    // console.log(adminUser);

    const userId = assignRoleDto.userId;
    console.log(userId);

    // if()
  }
}
