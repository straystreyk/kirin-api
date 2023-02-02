import express from "express";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import mongoose from "mongoose";

import { router } from "./router";
import { DB_CONNECTION_STRING, PORT } from "./constants";
import { errorLogger, errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();
app
  .disable("x-powered-by")
  .use(express.json())
  .use(cookieParser())
  .use("/api", router)
  .use(errorLogger)
  .use(errorMiddleware);

const startAPI = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(DB_CONNECTION_STRING as string);

    app.listen(+PORT, "127.0.0.1", () => {
      const port = chalk.bgYellow.black(` Server started on PORT:${PORT} `);
      const link = chalk.bgYellow.black(` Link is http://127.0.0.1:${PORT} `);

      console.log(port + "\n" + link);
    });
  } catch (e) {
    console.log(chalk.red.bgBlack(e.message));
  }
};

startAPI();
