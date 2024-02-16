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
import { LoginUserDto } from './dtos/login-user.dto';
import { CustomApiResponse } from 'src/utils/send-response';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async userLogin(@Body() loginUserDto: LoginUserDto) {
    try {

      const token = await this.authService.loginTokenGeneration(loginUserDto);
      return new CustomApiResponse(200, 'Logged in...', token);

    } catch (error) {

      throw new Error(error);

    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('details')
  async getDetails(@Req() req: Request) {
    const username = req.user['username'];
        
    const data = await this.authService.userDetails(username);
    return new CustomApiResponse(200, 'User Details Fetched', data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assign-roles')
  async assignRoles(@Body() updateRoleDto: UpdateRoleDto, @Req() req: Request) {
    const username = req.user['username'];
    
    const data = await this.authService.assignRoles(username, updateRoleDto);
    return new CustomApiResponse(200, 'User Role Updated', data);
  }
}
