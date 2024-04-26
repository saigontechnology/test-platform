import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class ExaminationAnswer {
  @IsNumber()
  @ApiProperty({ required: true })
  questionId: number;

  @IsNumber({}, { each: true })
  @ApiProperty({ required: false, isArray: true, type: Number })
  selections: number[];
}

export class CreateExaminationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsNumber()
  @ApiProperty({ required: false })
  assessmentId: number;

  @IsString()
  @ApiProperty({ required: true })
  expireUtil: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExaminationAnswer)
  @ApiProperty({ required: true, isArray: true, type: ExaminationAnswer })
  selections: ExaminationAnswer[];
}
