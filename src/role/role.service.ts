import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async assignRoles(username: string, updateRoleDto: UpdateRoleDto) {
    const superadminAssignableRoles = ['admin', 'editor', 'viewer'];
    const adminAssignableRoles = ['editor', 'viewer'];

    const fetchedUser = await this.userRepository.findOne({
      where: { username: updateRoleDto.username },
    });
    const changingRoleUser = await this.userRepository.findOne({
      where: { username },
    });
    const toBeChangedRole = updateRoleDto.roleName;
    const fetchedUserRoleName = await this.roleRepository.findOne({
      where: { roleId: fetchedUser.roleId },
    });

    if (!(changingRoleUser.roleId === 1 || changingRoleUser.roleId === 2)) {
      throw new UnauthorizedException(
        `You don't have the authority to assign roles`,
      );
    }

    if (changingRoleUser.userId === fetchedUser.userId) {
      throw new UnauthorizedException('You Cannot Change Your Own Role');
    }

    if (!superadminAssignableRoles.includes(toBeChangedRole)) {
      throw new BadRequestException('Invalid Role');
    }

    if (
      !(
        changingRoleUser.roleId === 1 &&
        superadminAssignableRoles.includes(toBeChangedRole)
      ) &&
      !(
        changingRoleUser.roleId === 2 &&
        adminAssignableRoles.includes(toBeChangedRole)
      )
    ) {
      throw new UnauthorizedException(
        'You are not Authorized to change the particular role',
      );
    }
    const fetchedUserRoleId = await this.roleRepository.findOne({
      where: { roleName: updateRoleDto.roleName },
    });
    fetchedUser.roleId = fetchedUserRoleId.roleId;

    await this.userRepository.save(fetchedUser);
    return {
      previousRole: fetchedUserRoleName.roleName,
      newRole: fetchedUserRoleId.roleName,
    };
  }

  async checkUserRoles(username: string) {
    const loggedInUser = await this.userRepository.findOne({
      where: { username },
    });
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
}
