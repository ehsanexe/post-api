import { generateError } from "../middlewares/errorHandler.js";
import Post from "../models/post.js";

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId });
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

    const post = new Post({
      title,
      content,
      imageUrl: "/images/shoe1.png",
      creator: "Bruce",
    });

    const result = await post.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: result,
    });
  } catch (error) {
    next(error);
  }
};
