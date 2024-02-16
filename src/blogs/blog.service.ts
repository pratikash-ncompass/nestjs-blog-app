import {
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { Blog } from 'src/entities/blog';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Topic } from 'src/entities/topic';
import { User } from 'src/entities/user';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createBlogDto: CreateBlogDto, req: Request) {
    const loggedInUser = req.user['username'];

    const loggedInUserDetails = await this.userRepository.findOne({
      where: { username: loggedInUser },
    });
    // console.log(loggedInUserDetails.userId);

    if (loggedInUserDetails.roleId === 4) {
      throw new UnauthorizedException(
        'You do not have permission to add a blog',
      );
    }

    const loggedInUserTopics = await this.topicRepository.find({
      where: { userId: loggedInUser.userId },
      select: ['name', 'topicId'],
    });
    // console.log(loggedInUserTopics);

    // console.log(loggedInUserTopics[1].name);
    const permittedTopics = [];
    for (let i = 0; i < loggedInUserTopics.length; i++) {
      permittedTopics.push(loggedInUserTopics[i].name.toLowerCase());
    }
    // console.log(permittedTopics);

    const isPermitted = permittedTopics.includes(
      createBlogDto.topicName.toLowerCase(),
    );
    // console.log(isPermitted)

    if (!isPermitted) {
      throw new UnauthorizedException(
        'You do not have permission to add a blog in this topic',
      );
    }

    const topicIdNewBlog = await this.topicRepository.find({
      where: { name: createBlogDto.topicName },
      //   select: ['topicId'],
    });
    const fetchedTopic = new Topic();
    Object.assign(fetchedTopic, topicIdNewBlog[0]);
    // console.log(fetchedTopic);

    // console.log(topicIdNewBlog[0].topicId);

    const newBlog = new Blog();
    newBlog.topicId = topicIdNewBlog[0].topicId;
    newBlog.userId = loggedInUserDetails.userId;
    newBlog.name = createBlogDto.name;
    newBlog.desc = createBlogDto.desc;
    newBlog.header = createBlogDto.header;
    newBlog.body = createBlogDto.body;
    newBlog.footer = createBlogDto.footer;

    // console.log(newBlog);
    newBlog.topic = fetchedTopic;

    await this.blogRepository.save(newBlog);
    return newBlog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, req: Request) {
    const loggedInUser = req.user['username'];
    const loggedInUserDetails = await this.userRepository.findOne({
      where: { username: loggedInUser },
    });

    const currentBlog = await this.blogRepository.findOne({
      where: { blogId: id },
    });
    if (loggedInUserDetails.userId !== currentBlog.userId) {
      throw new UnauthorizedException(
        'You do not have access to edit this blog since you have not created it.',
      );
    }
    
    currentBlog.name = updateBlogDto.name
      ? updateBlogDto.name
      : currentBlog.name;
    currentBlog.desc = updateBlogDto.desc
      ? updateBlogDto.desc
      : currentBlog.desc;
    currentBlog.header = updateBlogDto.header
      ? updateBlogDto.header
      : currentBlog.header;
    currentBlog.body = updateBlogDto.body
      ? updateBlogDto.body
      : currentBlog.body;
    currentBlog.footer = updateBlogDto.footer
      ? updateBlogDto.footer
      : currentBlog.footer;

    await this.blogRepository.save(currentBlog);

    return currentBlog;
  }
}
