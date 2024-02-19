import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CustomApiResponse } from 'src/utils/send-response';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
}
