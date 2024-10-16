import express from "express";
import { login, signUp } from "../controllers/auth.js";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/validators.js";

const authRouter = express.Router();

authRouter.post("/login", [...loginValidation], login);
authRouter.post("/signup", [...signupValidation], signUp);

export default authRouter;
