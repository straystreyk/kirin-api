import { model, Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  name?: string;
  isActivated: boolean;
  activationLink?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      minlength: 2,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationLink: {
      type: String,
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
