import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashPassword, posts: [] });
    const response = await user.save();
    const token = jwt.sign(
      { email, id: response._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "New user created!",
      token,
      user: { _id: response._id, email: response.email, posts: response.posts },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = jwt.sign(
      { email, id: req.user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { _id: req.user._id, email: req.user.email, posts: req.user.posts },
    });
  } catch (error) {
    next(error);
  }
};
