import User from "../models/user.js";
import Post from "../models/post.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const root = {
  hello() {
    return "HEllo";
  },
  setMessage({ message }) {
    return message;
  },
  async posts() {
    {
      try {
        // const page = req.query.page ?? 1;
        // const pageSize = req.query.pageSize ?? 10;
        // const totalRecords = await Post.find().countDocuments();

        const posts = await Post.find()
          .populate("creator")
          .sort({ createdAt: -1 });
        // .skip(pageSize * (page - 1))
        // .limit(pageSize);

        console.log({ posts });
        return posts;
      } catch (error) {
        next(error);
      }
    }
  },
  async createUser({ user }) {
    try {
      const { email, password, name } = user;
      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        posts: [],
      });
      const response = await newUser.save();
      const token = jwt.sign(
        { email, id: response._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return {
        id: response._id.toString(),
        name: response.name,
        email: response.email,
        posts: response.posts,
        token,
      };
    } catch (error) {
      throw error;
    }
  },
};
