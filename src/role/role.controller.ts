import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";

import { UpdateRoleDto } from "./dtos/update-role.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CustomApiResponse } from "src/utils/send-response";
import { RoleService } from "./role.service";


@Controller('role')
export class RoleController {

    constructor(private roleService: RoleService) {};

    @UseGuards(JwtAuthGuard)
    @Post('assign-roles')
    async assignRoles(@Body() updateRoleDto: UpdateRoleDto, @Req() req: Request) {
      const username = req.user['username'];
      
      const data = await this.roleService.assignRoles(username, updateRoleDto);
      return new CustomApiResponse(200, 'User Role Updated', data);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('user-roles')
    async checkUserRoles(@Req() req: Request) {
      const username = req.user['username'];
  
      const data = await this.roleService.checkUserRoles(username);
      return new CustomApiResponse(200, 'User Roles Fetched', data);
    }
}