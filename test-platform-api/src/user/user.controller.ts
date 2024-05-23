// src/user/user.controller.ts

import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "./role.decorator";
import { RoleGuard } from "./role.guard";

@Controller("user")
export class UserController {
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin", "User")
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
