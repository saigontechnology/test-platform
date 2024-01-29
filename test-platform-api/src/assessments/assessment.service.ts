import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { CreateAssessmentDto } from './dto/create-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssessmentDto: CreateAssessmentDto) {
    const { questions, ...createData } = createAssessmentDto;
    const assessment = await this.prisma.assessment.create({
      data: createData,
    });
    await this.prisma.assessmentQuestionMapping.createMany({
      data: questions.map((item: number) => {
        return {
          assessmentId: assessment.id,
          questionId: item,
        };
      }),
    });
    return;
  }

  async findAll() {
    return await this.prisma.assessment.findMany({
      select: {
        id: true,
        level: true,
        name: true,
        createdAt: true,
        assessmentQuestionMapping: {
          select: {
            createdAt: true,
            question: {
              select: {
                id: true,
                options: true,
                question: true,
                description: true,
                type: true,
                answer: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.assessment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        level: true,
        name: true,
        createdAt: true,
        assessmentQuestionMapping: {
          select: {
            createdAt: true,
            question: {
              select: {
                id: true,
                options: true,
                question: true,
                description: true,
                type: true,
                answer: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    const { questions, ...updateData } = updateAssessmentDto;
    await this.prisma.assessmentQuestionMapping.deleteMany({
      where: {
        assessmentId: id,
      },
    });
    await this.prisma.assessmentQuestionMapping.createMany({
      data: questions.map((item: number) => {
        return {
          assessmentId: id,
          questionId: item,
        };
      }),
    });
    return await this.prisma.assessment.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    await this.prisma.assessment.delete({ where: { id } });
    return;
  }
}
