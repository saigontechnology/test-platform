import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/user/role.decorator";
import { RoleGuard } from "src/user/role.guard";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { GenerateExplanationDto } from "./dto/generate-explanation.dto";
import { ImportQuestionsDto } from "./dto/import-questions.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QuestionEntity } from "./entities/question.entity";
import { QuestionsService } from "./question.service";

@Controller("admin/questions")
@ApiTags("questions")
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiCreatedResponse({ type: QuestionEntity })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.create(createQuestionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: QuestionEntity, isArray: true })
  async findAll(@Query() query) {
    return await this.questionService.findAll(query);
  }

  @Get("filters")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async getFilters() {
    return await this.questionService.getFilters();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: QuestionEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.questionService.findOne(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
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

  @Post("generate/explanation")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async generateExplanation(
    @Body(new ValidationPipe()) payloadData: GenerateExplanationDto,
  ) {
    return await this.questionService.generateExplanation(payloadData);
  }
}
