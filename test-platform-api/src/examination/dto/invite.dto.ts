import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InviteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  assessmentId: number;
}
