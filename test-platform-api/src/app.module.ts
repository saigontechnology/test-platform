import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { AssessmentsModule } from './assessments/assessment.module';
import { ExaminationsModule } from './examination/examinations.module';

@Module({
  imports: [
    PrismaModule,
    QuestionsModule,
    AssessmentsModule,
    ExaminationsModule,
  ],
  controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
