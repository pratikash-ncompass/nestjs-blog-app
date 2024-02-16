import { Body, Controller, Post } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";


@Controller('blog') 
export class BlogController {
    constructor(private readonly blogService: BlogService) {};

    @Post()
    async create(@Body() createBlogDto: CreateBlogDto) {

    }
}