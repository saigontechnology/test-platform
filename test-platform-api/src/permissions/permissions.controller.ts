import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/user/role.decorator";
import { RoleGuard } from "src/user/role.guard";
import { PermissionsService } from "./permissions.service";

@Controller("admin/permissions")
@ApiTags("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async getAll() {
    return await this.permissionsService.getAllPermissions();
  }

  @Get(":roleId")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles("Admin")
  @ApiOkResponse()
  async getRolePermissions(@Param("roleId", ParseIntPipe) roleId: number) {
    return await this.permissionsService.getPermissionsForRole(roleId);
  }
}
