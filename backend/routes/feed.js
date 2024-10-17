import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/feed.js";
import { creatPostValidator } from "../middlewares/validators.js";
import { isAuth } from "../middlewares/auth.js";

const feedRouter = express.Router();

feedRouter.use(isAuth);

feedRouter.get("/posts", getPosts);
feedRouter.get("/post/:postId", getPost);
feedRouter.post("/posts", [...creatPostValidator], createPost);
feedRouter.put("/post/:postId", [...creatPostValidator], updatePost);
feedRouter.delete("/post/:postId", deletePost);

export default feedRouter;
