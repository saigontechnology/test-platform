import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  level: string;

  @IsString()
  @ApiProperty({ required: false })
  name: string;
}
