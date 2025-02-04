import { Router } from "express";
import { adaptDb, login, register, updateProfile } from "./userController";
import {
  adaptDbValidator,
  loginValidator,
  registerValidator,
  updateProfileValidator,
  validate,
} from "../../middlewares/validation";

const userRouter = Router();

userRouter.route("/adapt-db").post(adaptDbValidator(), validate, adaptDb);
userRouter.route("/login").post(loginValidator(), validate, login);
userRouter.route("/register").post(registerValidator(), validate, register);
userRouter
  .route("/update-profile/:id")
  .post(updateProfileValidator(), validate, updateProfile);
userRouter.route("/forgot-password").post();

export default userRouter;
