import * as path from "path";
import * as fs from "fs";
import { Request, Response, NextFunction } from "express";
import { IS_DEV } from "../constants";

const errorLogFile = path.resolve(__dirname, "..", "..", "api-errors.log");

export const errorLogger = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = `[${new Date().toUTCString()}] ${req.method} ${
    req.url
  }: ${err.message}\n stack: ${err?.stack}`;
  fs.appendFile(errorLogFile, errorMessage, (fileWriteError) => {
    if (fileWriteError) {
      console.error(fileWriteError);
    }
  });
  next(err);
};

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errStatus = err?.status || err?.statusCode || 500;
  const errMsg = err?.message || "Something went wrong";
  const errors = err?.errors || [];

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: IS_DEV ? err.stack : {},
    errors,
  });
};
