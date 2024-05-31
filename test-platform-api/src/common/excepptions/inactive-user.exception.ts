// src/common/exceptions/inactive-user.exception.ts

import { HttpException, HttpStatus } from "@nestjs/common";

export class InactiveUserException extends HttpException {
  constructor() {
    super(
      "Your account is inactive. Please contact support.",
      HttpStatus.FORBIDDEN,
    );
  }
}
