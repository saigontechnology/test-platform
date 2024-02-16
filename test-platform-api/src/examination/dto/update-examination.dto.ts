import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { ExaminationAnswer } from "./create-examination.dto";

export class UpdateExaminationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExaminationAnswer)
  @ApiProperty({ required: true, isArray: true, type: ExaminationAnswer })
  selections: ExaminationAnswer[];
}
