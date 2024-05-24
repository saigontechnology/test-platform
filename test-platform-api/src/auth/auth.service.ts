// src/auth/auth.service.ts

import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { decrypt } from "src/utils/securities";
import { UnauthorizedException } from "src/common/excepptions/unauthorized.exception";
import { InactiveUserException } from "src/common/excepptions/inactive-user.exception";
import { UserStatus } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: { email: string; password: string }) {
    const passwordDecrypt = decrypt(user.password, process.env.SECRET_KEY);
    const userResult = await this.userService.findOneByEmail(user.email);

    if (
      userResult &&
      (await bcrypt.compare(passwordDecrypt, userResult.password))
    ) {
      if (userResult.active === UserStatus.INACTIVE) {
        throw new InactiveUserException();
      }

      return {
        accessToken: this.jwtService.sign({ email: userResult.email }),
      };
    }
    throw new UnauthorizedException();
  }
}
