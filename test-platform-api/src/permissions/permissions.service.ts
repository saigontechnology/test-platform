import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}
  // Block code

  async getAllPermissions() {
    return await this.prisma.userPermission.findMany();
  }

  async getPermissionsForRole(roleId: number) {
    const permissions = await this.prisma.userRolePermission.findMany({
      where: {
        roleId: roleId,
      },
      include: {
        permission: true,
      },
    });

    return permissions.map((permissionAssignment) => ({
      id: permissionAssignment.permissionId,
      name: permissionAssignment.permission.name,
      description: permissionAssignment.permission.description,
    }));
  }

  async upsertUserRolePermissions(
    rolePermissions: { roleId: number; permissionId: number }[],
  ) {
    const upsertPromises = rolePermissions.map(({ roleId, permissionId }) =>
      this.prisma.userRolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {}, // Specify fields to update if the record exists
        create: {
          roleId,
          permissionId,
        },
      }),
    );

    return Promise.all(upsertPromises);
  }
}
