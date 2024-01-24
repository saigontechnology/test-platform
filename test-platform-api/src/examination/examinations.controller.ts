import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ExaminationsService } from './examination.service';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { UpdateExaminationDto } from './dto/update-examination.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExaminationEntity } from './entities/examination';

@Controller('examinations')
@ApiTags('examinations')
export class ExaminationsController {
  constructor(private readonly examinationService: ExaminationsService) {}

  @Post()
  @ApiCreatedResponse({ type: ExaminationEntity })
  async create(@Body() createExaminationDto: CreateExaminationDto) {
    return await this.examinationService.create(createExaminationDto);
  }

  @Get()
  @ApiOkResponse({ type: ExaminationEntity, isArray: true })
  async findAll() {
    return await this.examinationService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ExaminationEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.examinationService.findOne(id);
  }

  @Put(':id')
  @ApiCreatedResponse({ type: ExaminationEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExaminationDto: UpdateExaminationDto,
  ) {
    return await this.examinationService.update(id, updateExaminationDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.examinationService.remove(id);
  }
}
