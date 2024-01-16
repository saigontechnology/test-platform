import { Question, QuestionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionEntity implements Question {
  @ApiProperty()
  id: number;

  @ApiProperty()
  sentence: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  answer: string[];

  @ApiProperty()
  options: string[];

  @ApiProperty({ enum: QuestionType })
  type: QuestionType;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
