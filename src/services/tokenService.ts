import jwt from "jsonwebtoken";
import { TokenModel } from "../models/tokenModel";
import { Types } from "mongoose";
import {
  JWT_REFRESH_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
} from "../constants";
import { IUser } from "../models/userModel";

const generateTokens = (payload: any) => {
  if (
    !JWT_ACCESS_SECRET ||
    !JWT_REFRESH_SECRET ||
    !JWT_REFRESH_EXPIRES_IN ||
    !JWT_ACCESS_EXPIRES_IN
  )
    throw new Error("TOKEN ERROR");

  console.log(JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN);

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const saveToken = async (userId: Types.ObjectId, refreshToken: string) => {
  const tokenData = await TokenModel.findOne({ userId: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return await tokenData.save();
  }
  const token = await TokenModel.create({ userId: userId, refreshToken });

  return token;
};

const removeToken = async (refreshToken: string) => {
  const tokenData = await TokenModel.deleteOne({ refreshToken });

  return tokenData;
};

const validateAccessToken = (token: string) => {
  try {
    if (!JWT_ACCESS_SECRET) return null;

    const userData = jwt.verify(token, JWT_ACCESS_SECRET);

    return userData;
  } catch (e) {
    return null;
  }
};

const validateRefreshToken = (token: string) => {
  try {
    if (!JWT_REFRESH_SECRET) return null;
    const userData = jwt.verify(token, JWT_REFRESH_SECRET);

    return userData as IUser & { _id: string };
  } catch (e) {
    return null;
  }
};

const findRefreshToken = async (refreshToken: string) => {
  const token = await TokenModel.findOne({ refreshToken });

  return token;
};

export const tokenService = {
  generateTokens,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findRefreshToken,
};
