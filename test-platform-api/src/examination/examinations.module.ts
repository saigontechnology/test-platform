import { Module } from "@nestjs/common";
import { ExaminationsService } from "./examination.service";
import { ExaminationsController } from "./examinations.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  controllers: [ExaminationsController],
  providers: [ExaminationsService],
  imports: [PrismaModule],
})
export class ExaminationsModule {}
