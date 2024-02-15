import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CustomError } from 'src/utils/custom-error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
        
    const user = await this.authService.validateUser(username, password);
    
    if (!user) {
      throw new CustomError(404, 'User Not Found');
    }
    return user;
  }
}