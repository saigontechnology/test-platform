import { Examination, ExaminationStatus, Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class ExaminationEntity implements Examination {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  assessmentId: number;

  @ApiProperty({ type: Number })
  score: Prisma.Decimal;

  submittedAnswers: number[];

  @ApiProperty({ enum: ExaminationStatus })
  status: ExaminationStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
