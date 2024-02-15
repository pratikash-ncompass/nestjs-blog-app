import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

// @Injectable()
// export class AuthService {
//   authUser(loginUserDto: LoginUserDto) {
//     return 'This action adds a new auth';
//   }

import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';
import { CustomError } from 'src/utils/custom-error';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const hashedPassword = md5(password);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .andWhere('user.password = :password', { password: hashedPassword })
      .getOne();

    return user;
  }

  async loginTokenGeneration(loginUserDto: LoginUserDto) {
    const payload = { username: loginUserDto.username };
    const accessToken = await this.jwtService.sign(payload);

    return accessToken;
  }
}
