import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { AssessmentsService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssessmentEntity } from './entities/assessment.entity';

@Controller('assessments')
@ApiTags('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentService: AssessmentsService) {}

  @Post()
  @ApiCreatedResponse({ type: AssessmentEntity })
  async create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return await this.assessmentService.create(createAssessmentDto);
  }

  @Get()
  @ApiOkResponse({ type: AssessmentEntity, isArray: true })
  async findAll() {
    return await this.assessmentService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: AssessmentEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.findOne(id);
  }

  @Put(':id')
  @ApiCreatedResponse({ type: AssessmentEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    return await this.assessmentService.update(id, updateAssessmentDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.assessmentService.remove(id);
  }
}
