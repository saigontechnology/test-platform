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

  // Utility function to convert BigInt to string
  serializeBigInt = (obj) => {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  };

  async retrieveQuestionMostAnswerWrong() {
    const result = await this.prisma.$queryRaw`
      WITH compared_answers AS (
        SELECT exAns.*, 
              questionAnswer.question, 
              questionAnswer.level, 
              questionAnswer.description,
              questionAnswer.options,
              questionAnswer.category,	
              questionAnswer.answer AS correct_answer,
              CASE WHEN exAns."selections" && questionAnswer.answer THEN 'True'
                    ELSE 'False'
              END AS Compared
        FROM public."ExamAnswer" AS exAns
        INNER JOIN (
          SELECT DISTINCT ON (id) id, score
          FROM public."Examination"
          WHERE score < 100
        ) AS examIds ON exAns."examinationId" = examIds.id
        INNER JOIN public."Question" AS questionAnswer ON exAns."questionId" = questionAnswer.id
      )
      SELECT "questionId", 
            COUNT(DISTINCT "examinationId") AS incorrect_times,
            MAX("question") AS question,
            MAX("level") AS level,
            MAX("description") AS description,
            MAX("options") AS options,
            MAX("category") AS category,
            MAX("correct_answer") AS correct_answer
      FROM compared_answers
      WHERE Compared = 'False'
      GROUP BY "questionId"
      ORDER BY incorrect_times DESC;
    `;
    const serializedResults = this.serializeBigInt(result);
    return serializedResults;
  }
}
