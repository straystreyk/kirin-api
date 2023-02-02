import { IUser, UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { mailService } from "./mailService";
import { getUserDto } from "../Dtos";
import { tokenService } from "./tokenService";

const registration = async (payload: IUser) => {
  const candidate = await UserModel.findOne({ email: payload.email });
  if (candidate)
    throw new Error(`Пользователь с email: ${payload.email} уже существует`);

  const hashedPassword = bcrypt.hash(payload.password, 3);
  const activationLink = hashedPassword + v4();
  const user = await UserModel.create(payload);
  await mailService.sendActivationLink(payload.email, activationLink);

  const userDto = getUserDto(user);
  const tokens = tokenService.generateTokens(userDto);

  await tokenService.saveToken(userDto._id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

export const userService = {
  registration,
};
