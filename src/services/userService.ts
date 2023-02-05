import { IUser, UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { mailService } from "./mailService";
import { getUserDto } from "../Dtos";
import { tokenService } from "./tokenService";
import { API_URL, JWT_ACCESS_EXPIRES_IN } from "../constants";
import { ApiError } from "../helpers/apiError";

const registration = async (
  payload: Omit<IUser, "expiresIn" | "createdAt" | "updatedAt">
) => {
  if (!JWT_ACCESS_EXPIRES_IN) return;

  const candidate = await UserModel.findOne({ email: payload.email });
  if (candidate) {
    throw ApiError.BadRequest("Пользователь с таким email уже зарегестрирован");
  }

  const hashedPassword = bcrypt.hashSync(payload.password, 3);
  const activationLink = v4() + Date.now();
  const user = await UserModel.create({
    ...payload,
    password: hashedPassword,
    activationLink: activationLink,
  });
  await mailService.sendActivationLink(
    payload.email,
    API_URL + "/activate/" + activationLink
  );

  const userDto = getUserDto(user);
  const tokens = tokenService.generateTokens(userDto);

  await tokenService.saveToken(userDto._id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

const login = async (username: string, password: string) => {
  const user = await UserModel.findOne({
    $or: [{ email: username }, { username }],
  });

  if (!user) throw ApiError.BadRequest("Пользователь не найден");
  if (!user.isActivated)
    throw ApiError.BadRequest(
      'Перед входом подтвердите аккаунт. Если мы не прислали письмо на почту, нажмите кнопку "Отправить письмо снова"'
    );

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect)
    throw ApiError.BadRequest("Неверный логин или пароль");

  const userDto = getUserDto(user);
  const tokens = tokenService.generateTokens(userDto);
  await tokenService.saveToken(userDto._id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

const logout = async (refreshToken: string) => {
  if (!refreshToken) throw ApiError.UnauthorizedError();
  const token = await tokenService.removeToken(refreshToken);

  return token;
};

const refresh = async (refreshToken: string) => {
  if (!refreshToken) throw ApiError.UnauthorizedError();

  const userData = tokenService.validateRefreshToken(refreshToken);
  if (!userData) throw ApiError.UnauthorizedError();
  const tokenFromDB = await tokenService.findRefreshToken(refreshToken);
  if (!tokenFromDB) throw ApiError.UnauthorizedError();

  return userData;
};

export const userService = {
  registration,
  login,
  logout,
  refresh,
};
