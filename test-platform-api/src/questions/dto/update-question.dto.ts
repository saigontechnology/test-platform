import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  @ApiProperty()
  question: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  answer: number[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  category: string;

  @IsOptional()
  @ApiProperty({ required: true, enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;
}
