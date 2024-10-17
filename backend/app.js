import "dotenv/config";
import express from "express";
import { setHeaders } from "./middlewares/setHeaders.js";
import mongoose from "mongoose";
import feedRouter from "./routes/feed.js";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { __dirname, upload } from "./middlewares/multer.js";
import authRouter from "./routes/auth.js";
import cors from "cors"

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(upload.single("image"));
app.use(bodyParser.json());
app.use(cors()); // to allow CORS

app.use("/auth", authRouter);
app.use("/feed", feedRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("connected");
  })
  .catch((err) => console.log(err));
