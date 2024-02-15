import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  authUser(loginUserDto: LoginUserDto) {
    return 'This action adds a new auth';
  }
}
