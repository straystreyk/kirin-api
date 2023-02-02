import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { IUser } from "../models/userModel";

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;
    const createUserData: IUser = {
      email,
      password,
      username,
      isActivated: false,
    };
    const userData = await userService.registration(createUserData);
    res.cookie("refreshToken", userData.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    });

    return res.json(userData);
  } catch (e) {
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (e) {}
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (e) {}
};

const activate = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (e) {}
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (e) {}
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (e) {}
};

export const userControllers = {
  login,
  logout,
  registration,
  getUsers,
  refresh,
  activate,
};
