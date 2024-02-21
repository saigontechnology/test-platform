import { Module } from "@nestjs/common";
import { AssessmentsService } from "./assessment.service";
import { AssessmentsController } from "./assessment.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  imports: [PrismaModule],
})
export class AssessmentsModule {}
