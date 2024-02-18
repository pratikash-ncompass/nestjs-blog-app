import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from 'src/entities/role';

@Module({
  imports :[
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
    PassportModule
    ],
  controllers: [RoleController],
  providers: [RoleService],
})

export class RoleModule {}
