import jwt from "jsonwebtoken";
import { generateError } from "./errorHandler.js";

export const isAuth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      generateError("Authentication failed!", 401);
    }
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      generateError("Authentication failed!", 401);
    }
    next();
  } catch (error) {
    next(error);
  }
};
