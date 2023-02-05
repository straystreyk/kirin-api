import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/apiError";
import { tokenService } from "../services/tokenService";
import { IUser } from "../models/userModel";

interface UserRequest extends Request {
  user: IUser;
}

export const authMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) return next(ApiError.UnauthorizedError());
    const accessToken = authorization.split(" ")[1];
    if (!accessToken) return next(ApiError.UnauthorizedError());

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) return next(ApiError.UnauthorizedError());

    req.user = userData as IUser;

    next();
  } catch (e) {
    next(ApiError.UnauthorizedError());
  }
};
