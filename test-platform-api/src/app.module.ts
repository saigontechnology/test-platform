import { Module } from "@nestjs/common";
import { AssessmentsModule } from "./assessments/assessment.module";
import { ExaminationsModule } from "./examination/examinations.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuestionsModule } from "./questions/questions.module";

@Module({
  imports: [
    PrismaModule,
    QuestionsModule,
    AssessmentsModule,
    ExaminationsModule,
  ],
})
export class AppModule {}
