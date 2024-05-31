import { Module } from "@nestjs/common";
import { AssessmentsService } from "src/assessments/assessment.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { ExaminationsService } from "./examination.service";
import { ExaminationsController } from "./examinations.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [ExaminationsController],
  providers: [ExaminationsService, AssessmentsService],
  imports: [PrismaModule, UserModule, JwtModule],
})
export class ExaminationsModule {}
