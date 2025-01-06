import User from "../models/user.js";
import Post from "../models/post.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export const root = {
  async posts(args, req) {
    try {
      if (!req.isAuth) {
        const error = {};
        error.data = new Error("Authentication failed!");
        error.code = 401;
        throw error;
      }

      const page = args.page ?? 1;
      const pageSize = args.pageSize ?? 10;
      const totalRecords = await Post.find().countDocuments();

      const posts = await Post.find()
        .populate("creator")
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      return { totalItems: totalRecords, posts };
    } catch (error) {
      throw error;
    }
  },
  async post({ id }, req) {
    try {
      if (!req.isAuth) {
        const error = {};
        error.data = new Error("Authentication failed!");
        error.code = 401;
        throw error;
      }

      const post = await Post.findById(id).populate("creator");
      if (!post) {
        const error = {};
        error.data = new Error("Post not found!");
        error.code = 404;
        throw error;
      }

      return post;
    } catch (error) {
      throw error;
    }
  },
  async createPost({ title, content, imageUrl }, req) {
    try {
      const user = await User.findById(req.userId);

      const post = new Post({
        title,
        content,
        imageUrl,
        creator: req.userId,
      });

      const result = await post.save();
      user.posts.push(result);
      await user.save();

      // websocket.getIo().emit("posts", { action: "create", post: result });

      return {
        id: post._id.toString(),
        title: post.title,
        imageUrl: post.imageUrl,
        content: post.content,
        creator: post.creator,
        createdAt: post.createdAt,
      };
    } catch (error) {
      console.log({ error });
      throw error;
    }
  },
  async updatePost({ title, content, imageUrl, postId }, req) {
    try {
      const post = await Post.findById(postId);
      const error = {};

      if (!post) {
        error.data = new Error("Post not found!");
        error.code = 404;
        throw error;
      }

      if (req.userId !== post.creator.toString()) {
        error.data = new Error("Not authorized!");
        error.code = 403;
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      const result = await post.save();

      return {
        id: result._id.toString(),
        title: result.title,
        imageUrl: result.imageUrl,
        content: result.content,
        creator: result.creator,
        createdAt: result.createdAt,
      };
    } catch (error) {
      throw error;
    }
  },
  async createUser({ user }) {
    try {
      const { email, password, name } = user;

      const errors = [];

      if (!validator.isEmail(email)) {
        errors.push("Invalid email!");
      }
      if (!validator.isLength(password, { min: 4, max: 20 })) {
        errors.push("Invalid password length!");
      }

      if (errors.length > 0) {
        const error = new Error(errors[0]);
        error.data = errors;
        error.code = 422;
        throw error;
      }

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
  async login({ email, password }) {
    try {
      const user = await User.findOne({ email });
      const errors = [];

      if (!user) {
        errors.push("Invalid email!");
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);

      if (!isCorrectPassword) {
        errors.push("Invalid password!");
      }

      if (errors.length > 0) {
        const error = new Error(errors[0]);
        error.data = errors;
        error.code = 422;
        throw error;
      }

      const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return {
        token,
        userId: user._id.toString(),
      };
    } catch (error) {
      throw error;
    }
  },
};
