import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { Blog } from 'src/entities/blog';
import { Topic } from 'src/entities/topic';
import { User } from 'src/entities/user';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PermissionTable } from 'src/entities/permission';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PermissionTable)
    private permissionRepository: Repository<PermissionTable>,
  ) {}


  async findBlogId(blogName: string) {
    const blogId = await this.blogRepository.findOne({
      where: { name: blogName },
    });
    return blogId.blogId;
  }

  async getBlogsOfATopic(topicId: string, req: Request) {
    
    const username = req.user['username'];
    const loggedInUser = await this.userRepository.findOne({
      where: { username },
    });

    const loggedInUserPermittedTopics = await this.permissionRepository.find({
      where: { userId: loggedInUser.userId, isViewer: true },
      select: ['topicId'],
    });

    const isLoggedInUserPermittedToViewBlogsOnGivenTopic =
      loggedInUserPermittedTopics
        .map((topic) => topic.topicId)
        .includes(topicId);

    if (!isLoggedInUserPermittedToViewBlogsOnGivenTopic) {
      throw new UnauthorizedException(
        'Not permitted to view blogs on this topic.',
      );
    }

    const fetchedBlogs = this.blogRepository.find({
      where: { topicId },
      select: [
        'name',
        'desc',
        'header',
        'body',
        'footer',
        'createdAt',
        'updatedAt',
      ],
    });

    return fetchedBlogs;
  }

  async getLoggedInUserBlogs(req: Request) {
    const username = req.user['username'];
    const loggedInUser = await this.userRepository.findOne({
      where: { username },
    });
    const fetchedBlogs = await this.blogRepository.find({
      where: { userId: loggedInUser.userId },
      select: [
        'name',
        'desc',
        'header',
        'body',
        'footer',
        'createdAt',
        'updatedAt',
      ],
    });

    return fetchedBlogs;
  }

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

    const topicToAddBlogTo = await this.topicRepository.findOne({
      where: { name: createBlogDto.topicName },
    });

    if (!topicToAddBlogTo) {
      throw new UnauthorizedException('Topic does not exist.');
    }

    const loggedInUserPermittedTopics = await this.permissionRepository.find({
      where: { userId: loggedInUserDetails.userId, isEditor: true },
      select: ['topicId'],
    });

    const isLoggedInUserPermittedToCreateBlogsOnGivenTopic =
      loggedInUserPermittedTopics
        .map((topic) => topic.topicId)
        .includes(topicToAddBlogTo.topicId);
    if (!isLoggedInUserPermittedToCreateBlogsOnGivenTopic) {
      throw new UnauthorizedException(
        'Not permitted to create blogs on this topic.',
      );
    }

    const newBlog = this.blogRepository.create({
      ...createBlogDto,
      topicId: topicToAddBlogTo.topicId,
      userId: loggedInUserDetails.userId,
      topic: topicToAddBlogTo,
    });

    const savedBlog = await this.blogRepository.save(newBlog, {});

    const {
      blogId: blogId1,
      topicId: topicId1,
      userId: userId1,
      ...savedBlogDetails
    } = savedBlog;
    const {
      blogId: blogId2,
      topicId: topicId2,
      userId: userId2,
      ...savedBlogDetailsWithoutTopic
    } = savedBlog;

    const {
      topicId: topicId3,
      userId: userId3,
      ...savedBlogDetailsForTopic
    } = savedBlogDetails.topic;

    const topic = savedBlogDetailsForTopic;

    const savedBlogResponse = {
      blog: {
        ...savedBlogDetailsWithoutTopic,
        topic,
      },
    };

    return savedBlogResponse;

    // const loggedInUserTopics = await this.topicRepository.find({
    //   where: { userId: loggedInUser.userId },
    //   select: ['name', 'topicId'],
    // });

    // const permittedTopics = [];
    // for (let i = 0; i < loggedInUserTopics.length; i++) {
    //   permittedTopics.push(loggedInUserTopics[i].name.toLowerCase());
    // }
    // // console.log(permittedTopics);

    // const isPermitted = permittedTopics.includes(
    //   createBlogDto.topicName.toLowerCase(),
    // );
    // // console.log(isPermitted)

    // if (!isPermitted) {
    //   throw new UnauthorizedException(
    //     'You do not have permission to add a blog in this topic',
    //   );
    // }
    // const topicNewBlog = await this.topicRepository.find({
    //   where: { name: createBlogDto.topicName },
    // });

    // const fetchedTopic = new Topic();
    // Object.assign(fetchedTopic, topicNewBlog[0]);
    // console.log(fetchedTopic.name);

    // const topicIdNew = topicNewBlog[0].topicId;

    // const newBlog = this.blogRepository.create({
    //   ...createBlogDto,
    //   topicId: topicIdNew,
    //   userId: loggedInUserDetails.userId,
    // });
    // newBlog.topic = fetchedTopic;
    // let savedBlog = await this.blogRepository.save(newBlog);
    // const { blogId, topicId, userId, ...createdBlog } = savedBlog;

    // return createdBlog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, req: Request) {
    const loggedInUser = req.user['username'];
    const loggedInUserDetails = await this.userRepository.findOne({
      where: { username: loggedInUser },
    });

    const blogToBeUpdated = await this.blogRepository.findOne({
      where: { blogId: id },
    });

    if (loggedInUserDetails.userId !== blogToBeUpdated.userId) {
      throw new UnauthorizedException(
        'You do not have access to edit this blog since you have not created it.',
      );
    }

    // blogToBeUpdated.name = updateBlogDto.name
    //   ? updateBlogDto.name
    //   : blogToBeUpdated.name;
    // blogToBeUpdated.desc = updateBlogDto.desc
    //   ? updateBlogDto.desc
    //   : blogToBeUpdated.desc;
    // blogToBeUpdated.header = updateBlogDto.header
    //   ? updateBlogDto.header
    //   : blogToBeUpdated.header;
    // blogToBeUpdated.body = updateBlogDto.body
    //   ? updateBlogDto.body
    //   : blogToBeUpdated.body;
    // blogToBeUpdated.footer = updateBlogDto.footer
    //   ? updateBlogDto.footer
    //   : blogToBeUpdated.footer;

    Object.keys(updateBlogDto).forEach((key) => {
      blogToBeUpdated[key] = updateBlogDto[key];
    });

    const updatedBlog = await this.blogRepository.save(blogToBeUpdated);

    const { blogId, topicId, ...updatedBlogDetails } = updatedBlog;

    return updatedBlogDetails;
  }

  async delete(id: string, req: Request) {
    const username = req.user['username'];
    const loggedInUser = await this.userRepository.findOne({
      where: { username },
    });

    const roleOfLoggedInUser = loggedInUser.roleId;

    if (loggedInUser.roleId === 4) {
      throw new UnauthorizedException(
        'You are not authorized to delete blogs.',
      );
    }

    const blogToBeDeleted = await this.blogRepository.findOne({
      where: { blogId: id },
    });

    if (!blogToBeDeleted) {
      throw new NotFoundException('Blog does not exist.');
    }

    const loggedInUserCreatedBlogs = await this.blogRepository.find({
      where: { userId: loggedInUser.userId },
    });

    if (!loggedInUser) {
      throw new UnauthorizedException('U have no created blogs');
    }

    const isLoggedInUserOwnerOfBlogToBeDeleted = loggedInUserCreatedBlogs
      .map((blog) => blog.blogId)
      .includes(blogToBeDeleted.blogId);

    if (
      !(
        isLoggedInUserOwnerOfBlogToBeDeleted ||
        roleOfLoggedInUser === 2 ||
        roleOfLoggedInUser === 1
      )
    ) {
      throw new UnauthorizedException(
        'You are not authorized to delete this blog.',
      );
    }

    await this.blogRepository.delete({ blogId: id });

    const {
      blogId: blogId1,
      topicId: topicId1,
      userId: userId1,
      ...deletedBlogDetails
    } = blogToBeDeleted;

    return deletedBlogDetails;
  }
}
