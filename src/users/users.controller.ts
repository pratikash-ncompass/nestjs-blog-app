import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CustomApiResponse } from 'src/utils/send-response';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    return new CustomApiResponse(200, 'User created succesfully', createdUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    return new CustomApiResponse(200, 'User fetched succesfully', user);
  }
}
