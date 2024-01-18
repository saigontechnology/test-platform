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
}
