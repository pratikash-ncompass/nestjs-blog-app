import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { CustomApiResponse } from 'src/utils/sendResponse';
import { CustomError } from 'src/utils/custom-error';
import { JwtService } from '@nestjs/jwt';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async userLogin(@Body() loginUserDto: LoginUserDto) {
    try {
      const token = await this.authService.loginTokenGeneration(loginUserDto);
      return new CustomApiResponse(200, 'Logged in...', token);
    } catch (error) {
      if (!(error instanceof CustomError)) {
        error = new CustomError(400, 'Something Went Wrong');
      }
      return error;
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Post('assign-role')
  async assignRoles(@Body() assignRoleDto: AssignRoleDto, @Req() req: Request) {
    let result = await this.authService.assignRolesToUsers(assignRoleDto, req);
    return new CustomApiResponse(200, 'Role Assigned successfully', result);
  }
}
