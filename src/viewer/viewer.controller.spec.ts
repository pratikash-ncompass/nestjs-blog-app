import { Test, TestingModule } from '@nestjs/testing';
import { ViewerController } from './viewer.controller';
import { ViewerService } from './viewer.service';

describe('ViewerController', () => {
  let controller: ViewerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewerController],
      providers: [ViewerService],
    }).compile();

    controller = module.get<ViewerController>(ViewerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
