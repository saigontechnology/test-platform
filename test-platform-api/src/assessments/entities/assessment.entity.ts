import { Assessment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AssessmentEntity implements Assessment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
