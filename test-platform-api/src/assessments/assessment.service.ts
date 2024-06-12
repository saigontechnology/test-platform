import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
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

  /** Raw query to retrieve question got answer wrong in all examination */
  async getIncorrectQuestionsByAssessmentId(assessmentId?: number) {
    const result = await this.prisma.$queryRaw`
      WITH compared_answers AS (
        SELECT exAns.*, 
              examination.email AS emails,
              examination."assessmentId",
              questionAnswer.question, 
              questionAnswer.level, 
              questionAnswer.category,  
              questionAnswer.answer AS correct_answer,
              CASE WHEN exAns."selections" && questionAnswer.answer THEN 'True'
                    ELSE 'False'
              END AS Compared
        FROM public."ExamAnswer" AS exAns
        INNER JOIN (
          SELECT DISTINCT ON (id) id, score, email, "assessmentId"
          FROM public."Examination"
          WHERE score < 100
        ) AS examination 
      ON exAns."examinationId" = examination.id 
        INNER JOIN public."Question" AS questionAnswer ON exAns."questionId" = questionAnswer.id
        ${
          assessmentId
            ? Prisma.sql`WHERE examination."assessmentId" = ${assessmentId}`
            : Prisma.empty
        }
      )
      SELECT "questionId", 
            CAST(COUNT(DISTINCT "examinationId") AS TEXT) AS incorrect_times,
            MAX(REPLACE("question", ',', ';')) AS question,
            MAX("level") AS level,
            MAX("category") AS category,
            STRING_AGG(DISTINCT SUBSTRING(emails, 1, POSITION('@' IN emails) - 1), '; ') AS emails
      FROM compared_answers
      WHERE Compared = 'False'
      GROUP BY "questionId"
      ORDER BY incorrect_times DESC;
  `;
    return result;
  }
}

export class ParseOptionalIntPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (value === undefined) {
      return undefined;
    }
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        "Validation failed: Numeric string is expected.",
      );
    }
    return parsedValue;
  }
}
