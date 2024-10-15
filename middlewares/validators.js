import { body, validationResult } from "express-validator";
import { generateError } from "./errorHandler.js";

export const creatPostValidator = [
  body("title").trim().isLength({ min: 3, max: 20 }),
  body("content").trim().isLength({ min: 3, max: 200 }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      generateError("Validation failed!", 422);
    }
    next();
  },
];
