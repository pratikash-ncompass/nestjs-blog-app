import { Injectable, NotFoundException, Req, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Blog } from "src/entities/blog";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { v4 as uuidv4 } from 'uuid'
import { Topic } from "src/entities/topic";
import { Request } from "express";
import { User } from "src/entities/user";


@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog) private blogRepository: Repository<Blog>,
        @InjectRepository(Topic) private topicRepository: Repository<Topic>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {};

    async create(createBlogDto: CreateBlogDto, @Req() req: Request) {
        // const { topicName, name, desc, header, body, footer } = createBlogDto;
        // const topic = this.topicRepository.findOne({ where: { name: topicName } });

        // if(!topic) {
        //     throw new NotFoundException('Topic not found.');
        // }

        // const username  = req.user;
        // const loggedInUser = this.userRepository.findOne({ where: { username: username } })
        // if(!loggedInUser && (await loggedInUser).roleId === 4) {
        //     throw new UnauthorizedException('Not authorized to create blogs.')
        // }
        // const newBlog = new Blog();
        // newBlog.blogId = uuidv4();
        // newBlog.topicId = (await topic).topicId;
        // newBlog.name = name;
        // newBlog.userId = (await loggedInUser).userId;
    }
}