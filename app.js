import "dotenv/config";
import express from "express";
import { setHeaders } from "./middlewares/setHeaders.js";
import mongoose from "mongoose";

const app = express();

app.use("/", setHeaders); 

app.use("/test", (req, res) => {
  res.json({ test: "test" });
});


mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
      app.listen(process.env.PORT);
      console.log("connected");
  })
  .catch((err) => console.log(err));

