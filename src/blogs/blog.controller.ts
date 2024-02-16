import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomApiResponse } from 'src/utils/send-response';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    const createdBlog = await this.blogService.create(createBlogDto, req);
    return new CustomApiResponse(200, 'Blog created succesfully', createdBlog);
  }

  
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string,  @Body() updateBlogDto: UpdateBlogDto, @Req() req: Request) {
      const updatedBlog = await this.blogService.update(id, updateBlogDto, req);
      return new CustomApiResponse(200, 'Blog updated succesfully', updatedBlog);
    }
}
