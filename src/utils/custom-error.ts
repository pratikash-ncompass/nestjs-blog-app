import { HttpException } from "@nestjs/common";

export class CustomError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super();
    // this.statusCode = statusCode || 400;
    // this.message = message || 'Something Went Wrong';
    // Object.setPrototypeOf(this, CustomError.prototype);
  }
}
