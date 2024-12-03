import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    let isAuth;
    if (!req.headers.authorization) {
      isAuth = false;
      return isAuth;
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      isAuth = false;
      return isAuth;
    }

    isAuth = true;
    return {isAuth, userId: decodedToken.id};
  } catch (error) {
    return false;
  }
};
