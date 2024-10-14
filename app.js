import "dotenv/config";
import express from "express";
import { setHeaders } from "./middlewares/setHeaders.js";
import mongoose from "mongoose";
import feedRouter from "./routes/feed.js";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

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
