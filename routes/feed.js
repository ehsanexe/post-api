import express from "express";
import { createPost, getPosts } from "../controllers/feed.js";
import { creatPostValidator } from "../middlewares/validators.js";

const feedRouter = express.Router();

feedRouter.get("/posts", getPosts);
feedRouter.post("/posts", [...creatPostValidator], createPost);

export default feedRouter;
