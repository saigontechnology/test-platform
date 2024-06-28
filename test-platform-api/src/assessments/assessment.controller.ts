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
    return await this.assessmentService.deleteAssessmentQuestion(
      assessmentId,
      questionId,
    );
  }

  @Put("admin/assessments/:assessmentId/question/:questionId")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiCreatedResponse({ type: AssessmentEntity })
  async updateAssessmentQuestion(
    @Param("assessmentId", ParseIntPipe) assessmentId: number,
    @Param("questionId", ParseIntPipe) questionId: number,
    @Body() data: any,
  ) {
    return await this.assessmentService.updateScoreAssessmentQuestion(
      assessmentId,
      questionId,
      data,
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

  /** Retrieve question exam's answers failed
   *  - The query parameter "assessmentId" is not required;
   *    by default, retrieve all questions were answered incorrectly.
   */
  @Get("admin/assessment/answers/wrong")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: AssessmentEntity })
  async getQuestionsExamAnswerFailed(
    @Query("assessmentId") assessmentId?: number,
  ) {
    return await this.assessmentService.getIncorrectQuestionsByAssessmentId(
      assessmentId,
    );
  }
}
