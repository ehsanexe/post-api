import express from "express";
import { createPost, getPost, getPosts } from "../controllers/feed.js";
import { creatPostValidator } from "../middlewares/validators.js";

const feedRouter = express.Router();

feedRouter.get("/posts", getPosts);
feedRouter.get("/post/:postId", getPost);
feedRouter.post("/posts", [...creatPostValidator], createPost);

export default feedRouter;
