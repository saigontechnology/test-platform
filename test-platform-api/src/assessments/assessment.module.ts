import { Module } from "@nestjs/common";
import { AssessmentsService } from "./assessment.service";
import { AssessmentsController } from "./assessment.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  imports: [PrismaModule, UserModule, JwtModule],
})
export class AssessmentsModule {}
