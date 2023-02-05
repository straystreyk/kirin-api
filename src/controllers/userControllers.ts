import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { userService } from "../services/userService";
import { IUser, UserModel } from "../models/userModel";
import { CLIENT_URL, JWT_REFRESH_EXPIRES_IN } from "../constants";
import { ApiError } from "../helpers/apiError";
import { getUserDto } from "../Dtos";
import { tokenService } from "../services/tokenService";

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!JWT_REFRESH_EXPIRES_IN)
      return next(ApiError.BadRequest("Ошибка сервера (переменные окружения)"));

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));

    const { email, password, username, name } = req.body;
    const createUserData: Omit<IUser, "createdAt" | "updatedAt"> = {
      email,
      password,
      username,
      name,
      isActivated: false,
    };

    const userData = await userService.registration(createUserData);
    if (!userData)
      return next(
        ApiError.BadRequest(
          "По какой-то причине полльзователь не был зарегестрирован"
        )
      );

    const maxAge = +JWT_REFRESH_EXPIRES_IN.split("ms")[0];

    res.cookie("refreshToken", userData.refreshToken, {
      httpOnly: true,
      maxAge,
    });

    return res.status(200).json({ response: { ...userData }, status: 200 });
  } catch (e) {
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!JWT_REFRESH_EXPIRES_IN)
      return next(ApiError.BadRequest("Ошибка сервера (переменные окружения)"));

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));

    const { username, password } = req.body;
    const userData = await userService.login(username, password);
    const maxAge = +JWT_REFRESH_EXPIRES_IN.split("ms")[0];

    res.cookie("refreshToken", userData.refreshToken, {
      httpOnly: true,
      maxAge,
    });

    return res.status(200).json({ response: { ...userData }, status: 200 });
  } catch (e) {
    next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return next(ApiError.UnauthorizedError());

    await userService.logout(refreshToken);
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({ response: { message: "success" }, status: 200 });
  } catch (e) {
    next(e);
  }
};

const activate = async (req: Request, res: Response, next: NextFunction) => {
  if (!CLIENT_URL)
    throw ApiError.BadRequest("Сука заполни переменные окружения");

  try {
    const link = req.params.link;
    const candidate = await UserModel.findOne({ activationLink: link });

    if (!candidate) throw ApiError.UnauthorizedError();
    await UserModel.updateOne({ _id: candidate._id }, { isActivated: true });

    await res.redirect(CLIENT_URL);
  } catch (e) {
    next(e);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!JWT_REFRESH_EXPIRES_IN)
      return next(ApiError.BadRequest("Ошибка сервера (переменные окружения)"));

    const { refreshToken } = req.cookies;
    if (!refreshToken) return next(ApiError.UnauthorizedError());

    const userData = await userService.refresh(refreshToken);
    if (!userData) return next(ApiError.UnauthorizedError());

    const user = await UserModel.findById(userData._id);
    if (!user) return next(ApiError.BadRequest("Такой пользователь не найден"));

    const userDto = getUserDto(user);
    const tokens = tokenService.generateTokens(userDto);

    return res
      .status(200)
      .json({ response: { ...tokens, user: userDto }, status: 200 });
  } catch (e) {
    next(e);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json("authrized!");
  } catch (e) {
    next(e);
  }
};

export const userControllers = {
  login,
  logout,
  registration,
  getUsers,
  refresh,
  activate,
};
