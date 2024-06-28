import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class GenerateExplanationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  question: string;

  @IsString()
  @ApiProperty({ required: false })
  description: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  options: string[];
}
