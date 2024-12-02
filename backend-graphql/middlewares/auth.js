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
    console.log({decodedToken})
    if (!decodedToken) {
      isAuth = false;
      return isAuth;
    }

    req.userId = decodedToken.id;
    isAuth = true;
    return isAuth;
  } catch (error) {
    return false;
  }
};
