import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAssessmentDto } from "./dto/create-assessment.dto";

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssessmentDto: CreateAssessmentDto) {
    const { ...createData } = createAssessmentDto;
    const assessment = await this.prisma.assessment.create({
      data: createData,
    });
    return assessment;
  }

  async findAll() {
    const assessments = await this.prisma.assessment.findMany({
      select: {
        id: true,
        level: true,
        name: true,
        createdAt: true,
        active: true,
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
                duration: true,
              },
            },
          },
        },
      },
    });

    return assessments.map((assessment) => {
      const questions = assessment.assessmentQuestionMapping.length;
      const duration = assessment.assessmentQuestionMapping.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.question.duration;
        },
        0,
      );
      return {
        ...assessment,
        questions,
        duration,
      };
    });
  }

  async findOne(id: number) {
    const assessment = await this.prisma.assessment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        level: true,
        name: true,
        createdAt: true,
        active: true,
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
                duration: true,
              },
            },
          },
        },
      },
    });
    const questions = assessment.assessmentQuestionMapping.length;
    const duration = assessment.assessmentQuestionMapping.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.question.duration;
      },
      0,
    );

    return {
      ...assessment,
      questions,
      duration,
    };
  }

  async update(id: number, data: any) {
    return await this.prisma.assessment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.prisma.assessment.delete({ where: { id } });
    return;
  }

  async findQuestionAssessmentWithoutAnswers(id: number) {
    const assessment = await this.prisma.assessment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        level: true,
        name: true,
        assessmentQuestionMapping: {
          select: {
            question: {
              select: {
                id: true,
                options: true,
                question: true,
                description: true,
                type: true,
                category: true,
                duration: true,
              },
            },
          },
        },
      },
    });
    const questions = assessment.assessmentQuestionMapping.length;
    const duration = assessment.assessmentQuestionMapping.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.question.duration;
      },
      0,
    );

    return {
      ...assessment,
      questions,
      duration,
    };
  }

  async addQuestionToAssessment(assessmentId: number, questionId: number) {
    return await this.prisma.assessmentQuestionMapping.create({
      data: { assessmentId, questionId },
    });
  }

  async deleteQuestionToAssessment(assessmentId: number, questionId: number) {
    return await this.prisma.assessmentQuestionMapping.deleteMany({
      where: {
        assessmentId,
        questionId,
      },
    });
  }
}
