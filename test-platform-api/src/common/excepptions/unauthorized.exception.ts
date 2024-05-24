// src/common/exceptions/forbidden-role.exception.ts

import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizedException extends HttpException {
  constructor() {
    super("Incorrect email or password", HttpStatus.UNAUTHORIZED);
  }
}
