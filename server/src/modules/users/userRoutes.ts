import { Router } from "express";
import { login } from "./userController";

const userRouter = Router();

userRouter.route("/adapt-db").post();
userRouter.route("/login").post(login);
userRouter.route("/register").post();
userRouter.route("/update-profile").post();
userRouter.route("/forgot-password").post();
