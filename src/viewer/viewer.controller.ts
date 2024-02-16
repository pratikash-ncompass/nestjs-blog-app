import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViewerService } from './viewer.service';
import { CreateViewerDto } from './dto/create-viewer.dto';
import { UpdateViewerDto } from './dto/update-viewer.dto';

@Controller('viewer')
export class ViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  @Post()
  create(@Body() createViewerDto: CreateViewerDto) {
    return this.viewerService.create(createViewerDto);
  }

  @Get()
  findAll() {
    return this.viewerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viewerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViewerDto: UpdateViewerDto) {
    return this.viewerService.update(+id, updateViewerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viewerService.remove(+id);
  }
}
