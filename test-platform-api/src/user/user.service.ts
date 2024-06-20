// src/user/user.service.ts

import { Injectable } from "@nestjs/common";
import { UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async getUserRolesAssignment(userId: number) {
    const role = await this.prisma.userRoleAssignment.findFirst({
      where: {
        userId,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    // Return an array of role names
    return role.role;
  }

  async findAllCandidates() {
    const results = await this.prisma.userRoleAssignment.findMany({
      where: {
        roleId: 2,
        user: {
          active: UserStatus.ACTIVE,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            empCode: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return results.map((result) => result.user);
  }
}
