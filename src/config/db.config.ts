import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user';
import { Topic } from 'src/entities/topic';
import { Editor } from 'src/entities/editor';
import { Viewer } from 'src/entities/viewer';
import { Blog } from 'src/entities/blog';

export const databaseConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User, Topic, Editor, Viewer, Blog],
  synchronize: true, 
});