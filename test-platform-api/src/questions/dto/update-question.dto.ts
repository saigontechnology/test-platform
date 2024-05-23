import { ApiProperty } from "@nestjs/swagger";
import { QuestionLevel, QuestionType } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

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
  @ApiProperty({ required: true, isArray: true, type: Number })
  answer: number[];

  @IsString()
  @ApiProperty({ required: false })
  notes: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  category: string;

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

  @IsOptional()
  @ApiProperty({ required: true, enum: QuestionLevel })
  @IsEnum(QuestionLevel)
  level: QuestionLevel;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Boolean })
  isModified: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Number })
  duration: number;
}
