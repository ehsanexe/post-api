import jwt from "jsonwebtoken";
import { generateError } from "./errorHandler.js";

export const isAuth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      generateError("Authentication failed!", 401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      generateError("Authentication failed!", 401);
    }
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    next(error);
  }
};
