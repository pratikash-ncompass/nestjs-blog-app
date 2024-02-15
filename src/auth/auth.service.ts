import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(loginUserDto: LoginUserDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  // async assignRoles(
  //   loggedInUserId: number,
  //   targetUserId: number,
  //   // roles: UserRole[],
  //   isAdmin: boolean,
  //   isSuperAdmin: boolean,
  // ): Promise<User> {
  //   // Check if the logged-in user is authorized
  //   const loggedInUser = await this.userRepository.findOne(loggedInUserId);

  //   if (!loggedInUser) {
  //     throw new NotFoundException('Logged-in user not found');
  //   }

  //   if (!isAdmin && !isSuperAdmin) {
  //     throw new UnauthorizedException(
  //       'Unauthorized. Only admin or superadmin can assign roles.',
  //     );
  //   }

  //   // Fetch the target user
  //   const targetUser = await this.userRepository.findOne(targetUserId);

  //   if (!targetUser) {
  //     throw new NotFoundException('Target user not found');
  //   }

  //   // Check if the logged-in user has the authority to assign roles
  //   if (isAdmin && !isSuperAdmin && !loggedInUser.isAdmin) {
  //     throw new UnauthorizedException(
  //       'Unauthorized. Only superadmin can assign admin roles.',
  //     );
  //   }

  //   // Assign roles to the target user
  //   // targetUser.roles = roles;

  //   // Save changes to the database
  //   await this.userRepository.save(targetUser);

  //   return targetUser;
  // }
}
