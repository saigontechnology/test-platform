import { Question, QuestionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionEntity implements Question {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  answer: number[];

  @ApiProperty()
  options: string[];

  @ApiProperty({ enum: QuestionType })
  type: QuestionType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
