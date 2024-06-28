import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  level: string;

  @IsString()
  @ApiProperty({ required: false })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  score!: number;
}
