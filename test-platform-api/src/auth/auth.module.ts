// src/auth/auth.module.ts

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: "7d" },
    }),
    UserModule, // Import UserModule here
    PrismaModule,
  ],
  controllers: [AuthController], // Declare AuthController here
  providers: [AuthService, JwtStrategy, LocalStrategy], // Include LocalStrategy here
  exports: [AuthService],
})
export class AuthModule {}
