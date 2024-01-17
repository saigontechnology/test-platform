import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class OptionItem {
  @IsString()
  @ApiProperty({ required: true })
  value: string;
}
export class QuestionItem {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  question: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  answer: number;

  @IsString()
  @ApiProperty({ required: true })
  description: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OptionItem)
  @ApiProperty({ required: true, isArray: true, type: OptionItem })
  options: OptionItem[];
}
export class CategoryItem {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  category: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionItem)
  @ApiProperty({ required: true, isArray: true, type: QuestionItem })
  questions: QuestionItem[];
}

export class ImportQuestionsDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CategoryItem)
  @ApiProperty({ required: true, isArray: true, type: CategoryItem })
  categories: CategoryItem[];
}
