import User from "../models/user";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    const res = await user.save();
    const token = jwt.sign({ email, id: res._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "New user created!",
      token,
      user: res,
    });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
    // try {
    //   const { email, password } = req.body;
    //   const user = new User({ email, password });
    //   const res = await user.save();
    //   const token = jwt.sign({ email, id: res._id }, process.env.JWT_SECRET, {
    //     expiresIn: "1h",
    //   });
  
    //   res.status(201).json({
    //     message: "New user created!",
    //     token,
    //     user: res,
    //   });
    // } catch (error) {
    //   next(error);
    // }
  };
  
