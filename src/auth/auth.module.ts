import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Topic } from 'src/entities/topic';
import { Editor } from 'src/entities/editor';
import { Viewer } from 'src/entities/viewer';
import { Role } from 'src/entities/role';

@Module({
  imports :[
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User, Topic, Editor, Viewer, Role]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '5h' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
