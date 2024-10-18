import "dotenv/config";
import express from "express";
import { setHeaders } from "./middlewares/setHeaders.js";
import mongoose from "mongoose";
import feedRouter from "./routes/feed.js";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { upload } from "./middlewares/multer.js";
import authRouter from "./routes/auth.js";
import websocket from "./websocket/websocket.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(upload.single("image"));
app.use(bodyParser.json());
app.use(setHeaders); // to allow CORS

app.use("/auth", authRouter);
app.use("/feed", feedRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    const server = app.listen(process.env.PORT);
    const io = websocket.init(server);
    io.on("connection", (socket) => {
      console.log("a user connected");
    });
    console.log("connected");
  })
  .catch((err) => console.log(err));
