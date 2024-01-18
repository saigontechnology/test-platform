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
import { QuestionsService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QuestionEntity } from './entities/question.entity';

@Controller('questions')
@ApiTags('questions')
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Post()
  @ApiCreatedResponse({ type: QuestionEntity })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.create(createQuestionDto);
  }

  @Get()
  @ApiOkResponse({ type: QuestionEntity, isArray: true })
  async findAll() {
    return await this.questionService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: QuestionEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.findOne(id);
  }

  @Put(':id')
  @ApiCreatedResponse({ type: QuestionEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: QuestionEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.remove(id);
  }
}
