import express from "express";
import { createPost, getPosts } from "../controllers/feed.js";

const feedRouter = express.Router();

feedRouter.get("/posts", getPosts);
feedRouter.post("/posts", createPost);

export default feedRouter;
