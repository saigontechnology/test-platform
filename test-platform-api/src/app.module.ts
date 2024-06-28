import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AssessmentsModule } from "./assessments/assessment.module";
import { AuthModule } from "./auth/auth.module";
import { ExaminationsModule } from "./examination/examinations.module";
import { HttpsAndCorsMiddleware } from "./middleware/https-redirect.middleware";
import { PermissionsModule } from "./permissions/permissions.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuestionsModule } from "./questions/questions.module";
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
    PermissionsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsAndCorsMiddleware).forRoutes("*"); // Apply to all routes
  }
}
