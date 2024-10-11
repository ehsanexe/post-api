import "dotenv/config";
import express from "express";
import { setHeaders } from "./middlewares/setHeaders.js";

const app = express();

app.use("/", setHeaders); 

app.use("/test", (req, res) => {
  res.json({ test: "test" });
});

app.listen(process.env.PORT);
