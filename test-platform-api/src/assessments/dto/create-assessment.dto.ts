import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  level: string;

  @IsString()
  @ApiProperty({ required: false })
  name: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true, isArray: true, type: Number })
  questions: number[];
}
