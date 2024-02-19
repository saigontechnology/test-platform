import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ImportQuestionsDto } from './dto/import-questions.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionEntity } from './entities/question.entity';
import { QuestionsService } from './question.service';

@Controller("questions")
@ApiTags("questions")
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

  @Get(":id")
  @ApiOkResponse({ type: QuestionEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.questionService.findOne(id);
  }

  @Put(":id")
  @ApiCreatedResponse({ type: QuestionEntity })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionService.update(id, updateQuestionDto);
  }

  @Delete(":id")
  @ApiOkResponse()
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.questionService.remove(id);
  }

  @Post("import")
  @ApiCreatedResponse()
  async import(@Body(new ValidationPipe()) importData: ImportQuestionsDto) {
    return await this.questionService.import(importData);
  }
}
