import "dotenv/config";
import express from "express";
import { setHeaders } from "./middlewares/setHeaders.js";
import mongoose from "mongoose";
import feedRouter from "./routes/feed.js";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { __dirname, upload } from "./middlewares/multer.js";

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(upload.single("image"));
app.use(bodyParser.json());
app.use("/", setHeaders); // to allow CORS

app.use(feedRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("connected");
  })
  .catch((err) => console.log(err));
