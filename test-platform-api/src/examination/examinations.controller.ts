import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateExaminationDto } from "./dto/create-examination.dto";
import { InviteDto } from "./dto/invite.dto";
import { UpdateExaminationDto } from "./dto/update-examination.dto";
import { ExaminationEntity } from "./entities/examination";
import { ExaminationsService } from "./examination.service";

@Controller("examinations")
@ApiTags("examinations")
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

  @Get(":id")
  @ApiOkResponse({ type: ExaminationEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.examinationService.findOne(id);
  }

  @Put(":id")
  @ApiCreatedResponse({ type: ExaminationEntity })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateExaminationDto: UpdateExaminationDto,
  ) {
    return await this.examinationService.update(id, updateExaminationDto);
  }

  @Delete(":id")
  @ApiOkResponse()
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.examinationService.remove(id);
  }

  @Post("invite")
  @ApiCreatedResponse({ type: ExaminationEntity })
  async invite(@Body() invite: InviteDto) {
    return await this.examinationService.invite(invite);
  }

  @Put("expired/:id")
  @ApiCreatedResponse({ type: ExaminationEntity })
  async updateExpireDate(@Param("id", ParseIntPipe) id: number) {
    console.log("updateExpireDate id: ", id);
    return await this.examinationService.updateExpireDate(id);
  }
}
