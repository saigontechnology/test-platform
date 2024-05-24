// src/common/exceptions/forbidden-role.exception.ts

import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenRoleException extends HttpException {
  constructor() {
    super("No permission to access this resource", HttpStatus.FORBIDDEN);
  }
}
