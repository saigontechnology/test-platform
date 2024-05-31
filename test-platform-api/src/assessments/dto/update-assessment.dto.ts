import { ApiProperty } from "@nestjs/swagger";

export class UpdateAssessmentDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  level?: string;
}
