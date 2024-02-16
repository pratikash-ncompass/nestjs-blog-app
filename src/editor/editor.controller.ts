import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EditorService } from './editor.service';

@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

}
