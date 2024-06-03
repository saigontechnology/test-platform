import { ApiProperty } from "@nestjs/swagger";
import { QuestionCategory, QuestionLevel, QuestionType } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  question: string;

  @IsOptional()
  @ApiProperty({ required: true, enum: QuestionLevel })
  @IsEnum(QuestionLevel)
  level: QuestionLevel;

  @IsString()
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @ApiProperty({ required: false })
  notes: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true, isArray: true, type: Number })
  answer: number[];

  @IsString()
  @IsNotEmpty()
  @IsEnum(QuestionCategory)
  @ApiProperty({ required: true })
  category: QuestionCategory;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true, isArray: true, type: String })
  categories: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  options: string[];

  @IsOptional()
  @ApiProperty({ required: true, enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Boolean })
  isModified: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Number })
  duration: number;
}
