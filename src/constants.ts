import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT || 5050;
export const IS_DEV = process.env.NODE_ENV === "development";
export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
