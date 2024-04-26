import { Injectable } from "@nestjs/common";
import { ExaminationStatus } from "@prisma/client";
import { AssessmentsService } from "src/assessments/assessment.service";
import { PrismaService } from "src/prisma/prisma.service";
import { inviteExamination, sendResult } from "src/utils/mailer";
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
    return await this.prisma.examination.findUnique({
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
          },
        },
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
    const { email, scored } = calculateExamScored(
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
    // await handleSendmail(email, assessmentInfo.name, scored);
    return { email, scored };
  }

  async remove(id: number) {
    await this.prisma.examination.delete({ where: { id } });
    return;
  }

  async invite(invite: InviteDto) {
    const examination = await this.prisma.examination.create({
      data: {
        assessmentId: invite.assessmentId,
        email: invite.email,
      },
    });
    await inviteExamination(invite.email, examination.id);
    return;
  }
}
