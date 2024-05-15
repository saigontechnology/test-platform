import { ApiProperty } from "@nestjs/swagger";
import { Question, QuestionLevel, QuestionType } from "@prisma/client";

export class QuestionEntity implements Question {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty({ enum: QuestionLevel })
  level: QuestionLevel;

  @ApiProperty()
  description: string;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  categories: string[];

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

  @ApiProperty()
  isModified: boolean;
}
