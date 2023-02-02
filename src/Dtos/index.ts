import { IUser } from "../models/userModel";
import { Types } from "mongoose";

export const getUserDto = (model: IUser & { _id: Types.ObjectId }) => {
  return {
    _id: model._id,
    email: model.email,
    username: model.username,
    ...(model?.name ? { name: model.name } : {}),
    ...(model?.activationLink ? { activationLink: model.activationLink } : {}),
  };
};
