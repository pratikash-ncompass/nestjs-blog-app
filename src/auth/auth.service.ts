import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { error } from 'console';

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

  async userDetails(username: string) {
    return await this.userRepository.findOne({ where: { username }});
  }

  async assignRoles(username: string, updateRoleDto: UpdateRoleDto) {
    try {
      const superadminAssignableRoles = [2, 3, 4];
      const adminAssignableRoles = [3, 4];

      const fetchedUser = await this.userRepository.findOne({ where : { username: updateRoleDto.username }});
      const changingRoleUser = await this.userRepository.findOne({ where : { username }});
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
    } catch (error) {
      throw new Error(error);
    }
  }
}
