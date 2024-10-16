import { body, validationResult } from "express-validator";
import { generateError } from "./errorHandler.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const checkValidation = (status) => {
  return (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      generateError(error.array()[0].msg, status);
    }
    next();
  };
};

export const creatPostValidator = [
  body("title").trim().isLength({ min: 3, max: 20 }),
  body("content").trim().isLength({ min: 3, max: 200 }),
  checkValidation(422),
];

export const signupValidation = [
  body("email").trim().isEmail().normalizeEmail(),
  body("email")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        generateError("Email already registered!", 422);
      }
    })
    .withMessage("E-mail already registered"),
  body("password").isLength({ min: 4, max: 20 }),
  checkValidation(422),
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("email").custom(async (value, { req }) => {
    const user = await User.findOne({ email: value });

    if (!user) {
      generateError("Invalid email!", 401);
    }
    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isCorrectPassword) {
      generateError("Invalid password!", 401);
    }
    req.user = user;
  }),
  checkValidation(422),
];
