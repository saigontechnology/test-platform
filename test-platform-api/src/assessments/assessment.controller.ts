import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AssessmentsService } from "./assessment.service";
import { CreateAssessmentDto } from "./dto/create-assessment.dto";
import { UpdateAssessmentDto } from "./dto/update-assessment.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AssessmentEntity } from "./entities/assessment.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RoleGuard } from "src/user/role.guard";
import { Roles } from "src/user/role.decorator";

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
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    return await this.assessmentService.update(id, updateAssessmentDto);
  }

  @Delete("admin/assessments/:id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.assessmentService.remove(id);
  }

  // User Routes
  @Get("assessment/:id")
  @ApiOkResponse({ type: AssessmentEntity })
  async findQuestionAssessmentWithoutAnswers(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return await this.assessmentService.findQuestionAssessmentWithoutAnswers(
      id,
    );
  }
}
