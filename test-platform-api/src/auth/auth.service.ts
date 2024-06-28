// src/auth/auth.service.ts

import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { InactiveUserException } from "src/common/excepptions/inactive-user.exception";
import { UnauthorizedException } from "src/common/excepptions/unauthorized.exception";
import { decrypt } from "src/utils/securities";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: { email: string; password: string }) {
    const passwordDecrypt = decrypt(user.password, process.env.SECRET_KEY);
    const userResult = await this.userService.findOneByEmail(user.email);
    const userPermissions = async () => {
      const userRole = await this.userService.getUserRolesAssignment(
        userResult.id,
      );
      const permissions = await this.userService.getPermissionsByRoleId(
        userRole.id,
      );
      return {
        role: userRole.name,
        permissions: permissions,
      };
    };

    if (
      userResult &&
      (await bcrypt.compare(passwordDecrypt, userResult.password))
    ) {
      if (userResult.active === UserStatus.INACTIVE) {
        throw new InactiveUserException();
      }

      return {
        accessToken: this.jwtService.sign({
          email: userResult.email,
          information: await userPermissions(),
        }),
      };
    }
    throw new UnauthorizedException();
  }
}
