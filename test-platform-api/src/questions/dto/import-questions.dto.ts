import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ImportQuestionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  sentence: string;

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
export class Category {
  @IsString()
  @ApiProperty({ required: true })
  category: string;

  questions
}

export class Question {
  @IsString()
  @ApiProperty({required: true})
  question: string
  
  @IsNumber()
  @ApiProperty({required: true})
  answer: number;
  
  @IsNumber()
  @ApiProperty({required: true})
  description: number;
}