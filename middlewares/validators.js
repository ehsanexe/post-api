import { body, validationResult } from "express-validator";

export const creatPostValidator = [
  body("title").trim().isLength({ min: 3, max: 20 }),
  body("content").trim().isLength({ min: 3, max: 200 }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const err = new Error("Validation failed!");
      err.statusCode = 422;
      throw err;
    }
    next();
  },
];
