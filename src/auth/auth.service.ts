import { Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
}
