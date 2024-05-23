import { Module } from "@nestjs/common";
import { AssessmentsModule } from "./assessments/assessment.module";
import { ExaminationsModule } from "./examination/examinations.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuestionsModule } from "./questions/questions.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    PrismaModule,
    QuestionsModule,
    AssessmentsModule,
    ExaminationsModule,
    AuthModule,
    UserModule,
    PrismaModule,
  ],
})
export class AppModule {}
