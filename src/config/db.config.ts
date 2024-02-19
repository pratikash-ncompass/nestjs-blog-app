import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/entities/user';
import { Topic } from 'src/entities/topic';
import { Blog } from 'src/entities/blog';
import { PermissionTable } from 'src/entities/permission';
import { Role } from 'src/entities/role';

export const databaseConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User, Topic, Blog, PermissionTable, Role],
  synchronize: true, 
});