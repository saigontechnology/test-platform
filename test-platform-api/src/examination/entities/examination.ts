import { ApiProperty } from "@nestjs/swagger";
import { Examination, ExaminationStatus, Prisma } from "@prisma/client";

export class ExaminationEntity implements Examination {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  assessmentId: number;

  @ApiProperty({ type: Date })
  expiredUntil: Date;

  @ApiProperty({ type: Number })
  score: Prisma.Decimal;

  submittedAnswers: number[];

  @ApiProperty({ enum: ExaminationStatus })
  status: ExaminationStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  expireUtil: Date;
}
