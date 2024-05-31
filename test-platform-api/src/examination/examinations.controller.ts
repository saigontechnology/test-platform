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
import { CreateExaminationDto } from "./dto/create-examination.dto";
import { InviteDto } from "./dto/invite.dto";
import { UpdateExaminationDto } from "./dto/update-examination.dto";
import { ExaminationEntity } from "./entities/examination";
import { ExaminationsService } from "./examination.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RoleGuard } from "src/user/role.guard";
import { Roles } from "src/user/role.decorator";

@Controller()
@ApiTags("examinations")
export class ExaminationsController {
  constructor(private readonly examinationService: ExaminationsService) {}

  // Admin Routes
  @Post("admin/examinations")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiCreatedResponse({ type: ExaminationEntity })
  async create(@Body() createExaminationDto: CreateExaminationDto) {
    return await this.examinationService.create(createExaminationDto);
  }

  @Get("admin/examinations")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: ExaminationEntity, isArray: true })
  async findAll() {
    return await this.examinationService.findAll();
  }

  @Get("admin/examinations/:id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: ExaminationEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.examinationService.findOne(id);
  }

  @Delete("admin/examinations/:id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.examinationService.remove(id);
  }

  @Post("admin/examinations/invite")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiCreatedResponse({ type: ExaminationEntity })
  async invite(@Body() invite: InviteDto) {
    return await this.examinationService.invite(invite);
  }

  @Get("admin/examinations/assessments/:id")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse({ type: ExaminationEntity, isArray: true })
  async findAllExaminationsByAssessmentId(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return await this.examinationService.findAllExaminationsByAssessmentId(id);
  }

  // User Routes
  @Get("examinations/:id")
  @ApiOkResponse({ type: ExaminationEntity })
  async findExaminationById(@Param("id", ParseIntPipe) id: number) {
    return await this.examinationService.findExaminationByIdWithoutSubmitAnswer(
      id,
    );
  }

  @Put("examinations/expired/:id")
  @ApiCreatedResponse({ type: ExaminationEntity })
  async updateExpireDate(@Param("id", ParseIntPipe) id: number) {
    return await this.examinationService.updateExpireDate(id);
  }

  @Put("examinations/:id")
  @ApiCreatedResponse({ type: ExaminationEntity })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateExaminationDto: UpdateExaminationDto,
  ) {
    return await this.examinationService.update(id, updateExaminationDto);
  }
}
