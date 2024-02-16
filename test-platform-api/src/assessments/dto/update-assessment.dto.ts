import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateAssessmentDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  level: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true, isArray: true, type: Number })
  questions: number[];
}
