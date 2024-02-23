import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { ExaminationAnswer } from "./create-examination.dto";

export class UpdateExaminationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExaminationAnswer)
  @ApiProperty({ required: true, isArray: true, type: ExaminationAnswer })
  selections: ExaminationAnswer[];

  @IsNumber()
  @ApiProperty({ required: true })
  assessmentId: number;

  @IsString()
  @ApiProperty({ required: true })
  email: string;
}
