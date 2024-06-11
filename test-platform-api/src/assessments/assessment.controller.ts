import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/user/role.decorator";
import { RoleGuard } from "src/user/role.guard";
import { AssessmentsService } from "./assessment.service";
import { CreateAssessmentDto } from "./dto/create-assessment.dto";
import { AssessmentEntity } from "./entities/assessment.entity";

@Controller()
@ApiTags("assessments")
export class AssessmentsController {
  constructor(private readonly assessmentService: AssessmentsService) {}

  // Admin Routes
  @Post("admin/assessments")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiCreatedResponse({ type: AssessmentEntity })
  async create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return await this.assessmentService.create(createAssessmentDto);
  }

  @Get("admin/assessments")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: AssessmentEntity, isArray: true })
  async findAll() {
    return await this.assessmentService.findAll();
  }

  @Get("admin/assessments/:id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: AssessmentEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.assessmentService.findOne(id);
  }

  @Put("admin/assessments/:id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiCreatedResponse({ type: AssessmentEntity })
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: any) {
    return await this.assessmentService.update(id, data);
  }

  @Delete("admin/assessments/:id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.assessmentService.remove(id);
  }

  @Post("admin/assessments/question")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiCreatedResponse()
  async addQuestionToAssessment(@Body() body) {
    const assessmentId = parseInt(body.assessmentId);
    const questionId = parseInt(body.questionId);

    return await this.assessmentService.addQuestionToAssessment(
      assessmentId,
      questionId,
    );
  }

  @Delete("admin/assessments/:assessmentId/question/:questionId")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async deleteQuestionToAssessment(
    @Param("assessmentId", ParseIntPipe) assessmentId: number,
    @Param("questionId", ParseIntPipe) questionId: number,
  ) {
    return await this.assessmentService.deleteQuestionToAssessment(
      assessmentId,
      questionId,
    );
  }

  // User Routes
  @Get("assessment/:id")
  @ApiOkResponse()
  async findQuestionAssessmentWithoutAnswers(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return await this.assessmentService.findQuestionAssessmentWithoutAnswers(
      id,
    );
  }

  // Retrieve question exam's answers failed
  @Get("admin/assessment/examAnswers/wrong")
  @ApiOkResponse({ type: AssessmentEntity })
  async getQuestionsExamAnswerFailed() {
    return await this.assessmentService.retrieveQuestionMostAnswerWrong();
  }
}
