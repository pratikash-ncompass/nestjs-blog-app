import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { CustomApiResponse } from 'src/utils/sendResponse';
import { CustomError } from 'src/utils/custom-error';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService) {}


  // @Post()
  // create(@Body() loginUserDto: LoginUserDto) {
  //   return this.authService.authUser(loginUserDto);

  @UseGuards(LocalAuthGuard)
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
}
