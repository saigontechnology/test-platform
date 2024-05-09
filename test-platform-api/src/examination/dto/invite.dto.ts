import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class InviteDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true, isArray: true, type: Number })
  email: string[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  assessmentId: number;
}
