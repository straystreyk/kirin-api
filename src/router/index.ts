import express from "express";
import { userControllers } from "../controllers/userControllers";

export const router = express.Router();

router.post("/registration", userControllers.registration);
router.post("/login", userControllers.login);
router.post("/logout", userControllers.logout);
router.get("/activate/:link", userControllers.activate);
router.get("/refresh", userControllers.refresh);
router.get("/users", userControllers.getUsers);
