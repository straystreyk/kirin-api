import express from "express";
import { body } from "express-validator";
import { userControllers } from "../controllers/userControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

export const router = express.Router();

router.post(
  "/registration",
  body("email", "Некорректный формат email").isEmail(),
  body("username", "Имя пользователя должно быть длиннее 2 символов").isLength({
    min: 2,
  }),
  body("password").isLength({ min: 6, max: 24 }),
  userControllers.registration
);
router.post(
  "/login",
  body("username", "Вы отправили пустое имя пользователя").not().isEmpty(),
  body("password", "Вы отправили пустой пароль").not().isEmpty(),
  userControllers.login
);
router.post("/logout", userControllers.logout);
router.get("/activate/:link", userControllers.activate);
router.get("/refresh", userControllers.refresh);
router.get("/users", authMiddleware, userControllers.getUsers);
