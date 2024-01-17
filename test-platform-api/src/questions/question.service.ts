import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    return await this.prisma.question.create({ data: createQuestionDto });
  }

  async findAll() {
    return await this.prisma.question.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.question.findUnique({ where: { id } });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return await this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  async remove(id: number) {
    await this.prisma.question.delete({ where: { id } });
    return;
  }

  async import(importData: any) {
    const questions = [];
    for (const category of importData.categories) {
      for (const question of category.questions) {
        questions.push({
          category: category.category,
          question: question.question,
          description: question.description,
          answer: [question.answer],
          options: question.options.map((item: any) => item.value),
        });
      }
    }
    await this.prisma.question.createMany({ data: questions });
    return;
  }
}
