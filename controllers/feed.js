import { generateError } from "../middlewares/errorHandler.js";
import { __dirname } from "../middlewares/multer.js";
import Post from "../models/post.js";
import fs from "fs";
import path from "path";
import User from "../models/user.js";

export const getPosts = async (req, res, next) => {
  try {
    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 10;
    const totalRecords = await Post.find().countDocuments();

    const posts = await Post.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.status(200).json({
      posts,
      totalCount: totalRecords,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      generateError("Post not found!", 404);
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file.path;

    const user = await User.findById(req.userId);

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });

    const result = await post.save();
    console.log({user})
    user.posts.push(result);
    await user.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    const { title, content } = req.body;
    const imageUrl = req.file.path;

    if (!post) {
      generateError("Post not found!", 404);
    }

    if (imageUrl !== post.imageUrl) {
      clearFile(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const result = await post.save();
    res.status(201).json({ message: "Post updated!", post: result });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      generateError("Post not found!", 404);
    }

    clearFile(post.imageUrl);
    const result = await post.deleteOne();
    res.status(200).json({ message: "Post deleted!", post: result });
  } catch (error) {
    next(error);
  }
};

const clearFile = (filePath) => {
  const delPath = path.join(__dirname, "..", filePath);
  fs.unlink(delPath, (err) => {
    if (err) throw err;
  });
};
