import express from "express";
import { login, signUp } from "../controllers/auth.js";
import { authValidation } from "../middlewares/validators.js";

const authRouter = express.Router();

authRouter.post("/login", [...authValidation], login);
authRouter.post("/signup", [...authValidation], signUp);

export default authRouter;
