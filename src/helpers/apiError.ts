import { ValidationError } from "express-validator";

export class ApiError extends Error {
  status;
  errors;
  name;

  constructor(
    status: number,
    message: string,
    errors: string[] | ValidationError[] = []
  ) {
    super(message);
    this.name = "Api Error";
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BadRequest(
    message: string,
    errors: string[] | ValidationError[] = []
  ) {
    return new ApiError(400, message, errors);
  }
}