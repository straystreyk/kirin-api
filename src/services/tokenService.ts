import jwt from "jsonwebtoken";
import { TokenModel } from "../models/tokenModel";
import { Types } from "mongoose";

const generateTokens = (payload: any) => {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)
    throw new Error("TOKEN ERROR");

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
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

export const tokenService = {
  generateTokens,
  saveToken,
};
