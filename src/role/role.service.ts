import { BadRequestException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user";
import { Repository } from "typeorm";


@Injectable()
export class RoleService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {};

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
          throw new HttpException(error, 400);
        }
      }
    
      async checkUserRoles(username: string) {
        const loggedInUser = await this.userRepository.findOne({ where : { username }});
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