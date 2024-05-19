import { ApiProperty } from "@nestjs/swagger";
import { Assessment } from "@prisma/client";

export class AssessmentEntity implements Assessment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
