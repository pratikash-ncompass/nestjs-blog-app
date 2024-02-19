import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { User } from 'src/entities/user';
import { Role } from 'src/entities/role';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports :[
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User, Role]),
    // JwtModule.register({
    //   secret: process.env.SECRET_KEY,
    //   signOptions: { expiresIn: process.env.EXPIRES_IN },
    // }),
    PassportModule
    ],
  controllers: [RoleController],
  providers: [RoleService],
})

export class RoleModule {}
