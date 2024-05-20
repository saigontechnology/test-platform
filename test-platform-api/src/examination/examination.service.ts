import { Injectable } from "@nestjs/common";
import { ExaminationStatus } from "@prisma/client";
import { AssessmentsService } from "src/assessments/assessment.service";
import { PrismaService } from "src/prisma/prisma.service";
import { inviteExamination, sendResult } from "src/utils/mailer";
import { regexEmailPattern } from "src/utils/regex";
import { calculateExamScored } from "src/utils/scoring";
import {
  CreateExaminationDto,
  ExaminationAnswer,
} from "./dto/create-examination.dto";
import { InviteDto } from "./dto/invite.dto";
import { UpdateExaminationDto } from "./dto/update-examination.dto";

@Injectable()
export class ExaminationsService {
  constructor(
    private prisma: PrismaService,
    private assessment: AssessmentsService,
  ) {}

  async create(createExaminationDto: CreateExaminationDto) {
    const { selections, ...examinationData } = createExaminationDto;
    const examination = await this.prisma.examination.create({
      data: examinationData,
    });
    await this.prisma.examAnswer.createMany({
      data: selections.map((item: ExaminationAnswer) => {
        return {
          examinationId: examination.id,
          questionId: item.questionId,
          selections: item.selections,
        };
      }),
      skipDuplicates: true,
    });
    return;
  }

  async findAll() {
    return await this.prisma.examination.findMany({
      select: {
        id: true,
        email: true,
        score: true,
        status: true,
        createdAt: true,
        assessment: {
          select: {
            name: true,
            level: true,
          },
        },
        expireUtil: true,
        submittedAnswers: {
          select: {
            question: {
              select: {
                question: true,
                options: true,
              },
            },
            selections: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    let result = await this.prisma.examination.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        score: true,
        status: true,
        createdAt: true,
        assessmentId: true,
        assessment: {
          select: {
            name: true,
            level: true,
            assessmentQuestionMapping: {
              select: {
                question: true,
              },
            },
          },
        },
        expireUtil: true,
        submittedAnswers: {
          select: {
            question: {
              select: {
                question: true,
                options: true,
              },
            },
            selections: true,
          },
        },
      },
    });

    const durationTotal = result?.assessment?.assessmentQuestionMapping?.reduce(
      (total, item) => {
        const duration = item?.question?.duration ?? 0;
        return total + duration;
      },
      0,
    );

    let resultFormat: any = { ...result };
    resultFormat.durationTotal = durationTotal;
    resultFormat.questionNumbers = result?.assessment?.assessmentQuestionMapping.length;

    delete resultFormat.assessment.assessmentQuestionMapping;

    return { ...resultFormat };
  }

  async update(id: number, updateExaminationDto: UpdateExaminationDto) {
    await this.prisma.examAnswer.deleteMany({
      where: {
        examinationId: id,
      },
    });
    await this.prisma.examAnswer.createMany({
      data: updateExaminationDto.selections.map((item: ExaminationAnswer) => {
        return {
          examinationId: id,
          questionId: item.questionId,
          selections: item.selections,
        };
      }),
    });
    const assessmentInfo = await this.assessment.findOne(
      updateExaminationDto.assessmentId,
    );
    const { email, scored, correctQuestions } = calculateExamScored(
      assessmentInfo,
      updateExaminationDto.selections,
      updateExaminationDto.email,
    );
    const examStatus =
      scored > 65 ? ExaminationStatus.COMPLETED : ExaminationStatus.EVALUATED;
    await this.prisma.examination.updateMany({
      where: {
        id: id,
      },
      data: {
        score: scored,
        status: examStatus,
      },
    });
    await sendResult(email, assessmentInfo.name, scored);
    return { email, scored, correctQuestions };
  }

  async remove(id: number) {
    await this.prisma.examination.delete({ where: { id } });
    return;
  }

  /** Updated:
   *  - Send invitation to multiple candidates.
   */
  async invite(invite: InviteDto) {
    let expireTime = null;
    const assessmentID = invite.assessmentId;
    const periodDays = 5;

    await (() => {
      let result = new Date();
      result.setDate(result.getDate() + periodDays);
      expireTime = result;
    })();

    await invite.email.forEach(async (candidate: string) => {
      // Handle email pattern:
      if (!regexEmailPattern(candidate)) {
        candidate = candidate + "@saigontechnology.com";
      }

      if (expireTime) {
        const examination = await this.prisma.examination.create({
          data: {
            assessmentId: assessmentID,
            email: candidate,
            expireUtil: expireTime,
          },
        });
        inviteExamination(candidate, examination.id);
      }
    });
    return;
  }

  async updateExpireDate(id: number) {
    await this.prisma.examination.update({
      where: {
        id: id,
      },
      data: {
        expireUtil: new Date(),
      },
    });
    return;
  }
}
