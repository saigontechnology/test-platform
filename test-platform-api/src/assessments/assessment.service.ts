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
        score: true,
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
        score: true,
        assessmentQuestionMapping: {
          select: {
            id: true,
            createdAt: true,
            score: true,
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
                level: true,
              },
            },
          },
          orderBy: {
            id: "asc",
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
    const question = await this.prisma.assessmentQuestionMapping.create({
      data: { assessmentId, questionId },
    });
    await this.updateTotalScore(assessmentId);
    return question;
  }

  async deleteAssessmentQuestion(assessmentId: number, questionId: number) {
    const deletedQuestion =
      await this.prisma.assessmentQuestionMapping.deleteMany({
        where: {
          assessmentId,
          questionId,
        },
      });
    await this.updateTotalScore(assessmentId);
    return deletedQuestion;
  }

  async updateScoreAssessmentQuestion(
    assessmentId: number,
    questionId: number,
    data: any,
  ) {
    const updatedScore = await this.prisma.assessmentQuestionMapping.updateMany(
      {
        where: {
          assessmentId,
          questionId,
        },
        data,
      },
    );

    await this.updateTotalScore(assessmentId);

    return updatedScore;
  }

  async updateTotalScore(assessmentId: number) {
    const assessment = await this.findOne(assessmentId);
    const score = assessment.assessmentQuestionMapping.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.score;
      },
      0,
    );
    return await this.update(assessmentId, { score });
  }

  /** Raw query to retrieve question got answer wrong in all examination */
  async retrieveQuestionMostAnswerWrong() {
    const result = await this.prisma.$queryRaw`
      WITH compared_answers AS (
        SELECT exAns.*, 
              examIds.email AS emails,
              questionAnswer.question, 
              questionAnswer.level, 
              questionAnswer.category,  
              questionAnswer.answer AS correct_answer,
              CASE WHEN exAns."selections" && questionAnswer.answer THEN 'True'
                    ELSE 'False'
              END AS Compared
        FROM public."ExamAnswer" AS exAns
        INNER JOIN (
          SELECT DISTINCT ON (id) id, score, email
          FROM public."Examination"
          WHERE score < 100
        ) AS examIds ON exAns."examinationId" = examIds.id
        INNER JOIN public."Question" AS questionAnswer ON exAns."questionId" = questionAnswer.id
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
