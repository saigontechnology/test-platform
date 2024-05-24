import { Module } from "@nestjs/common";
import { QuestionsService } from "./question.service";
import { QuestionsController } from "./questions.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [PrismaModule, JwtModule, UserModule],
  exports: [QuestionsService]
})
export class QuestionsModule {}
