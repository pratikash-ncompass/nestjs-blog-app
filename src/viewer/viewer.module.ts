import { Module } from '@nestjs/common';
import { ViewerService } from './viewer.service';
import { ViewerController } from './viewer.controller';

@Module({
  controllers: [ViewerController],
  providers: [ViewerService],
})
export class ViewerModule {}
