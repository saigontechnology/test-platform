import { Injectable } from "@nestjs/common";
import { QuestionCategory, QuestionLevel, QuestionType } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { ImportQuestionsDto, OptionItem } from "./dto/import-questions.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    return await this.prisma.question.create({ data: createQuestionDto });
  }

  async findAll(query) {
    const { page, limit, search, ...rest } = query;
    const numPage = parseInt(page) || 1;
    const numLimit = parseInt(limit) || 10;
    const skip = (numPage - 1) * numLimit || 0;

    let filters = [];
    if (rest) {
      Object.entries(rest).forEach(([key, value]: any) => {
        filters.push({
          [key]: {
            in: value.split(","),
          },
        });
      });
    }

    if (search) {
      if (!isNaN(search)) {
        filters.push({
          id: +search,
        });
      } else {
        filters.push({
          OR: [
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              question: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        });
      }
    }

    const conditions = {
      where: {
        AND: filters,
      },
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.question.count(conditions),
      this.prisma.question.findMany({
        skip,
        take: numLimit,
        ...conditions,
      }),
    ]);

    const totalPages = Math.ceil(total / numLimit);

    return {
      total,
      numLimit,
      numPage,
      totalPages,
      data,
      start: skip + 1,
      end: numPage * numLimit,
    };
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

  async import(importData: ImportQuestionsDto) {
    const questions = [];
    for (const category of importData.categories) {
      for (const question of category.questions) {
        questions.push({
          category: category.category,
          question: question.question,
          description: question.description,
          answer: [question.answer],
          options: question.options.map((item: OptionItem) => item.value),
        });
      }
    }
    await this.prisma.question.createMany({ data: questions });
    return;
  }

  async getFilters() {
    return {
      category: Object.entries(QuestionCategory).map(([key, value]) => value),
      level: Object.entries(QuestionLevel).map(([key, value]) => value),
      type: Object.entries(QuestionType).map(([key, value]) => value),
    };
  }
}
