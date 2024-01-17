import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  sentence: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  answer: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  category: string;

  @IsOptional()
  @ApiProperty({ required: true, enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;
}
