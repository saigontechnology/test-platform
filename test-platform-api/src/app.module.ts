import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { AssessmentsModule } from './assessments/assessment.module';

@Module({
  imports: [PrismaModule, QuestionsModule, AssessmentsModule],
  controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
