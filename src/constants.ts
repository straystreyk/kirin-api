import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5050;
export const IS_DEV = process.env.NODE_ENV === "development";
export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const API_URL = process.env.API_URL;
export const CLIENT_URL = process.env.CLIENT_URL;
