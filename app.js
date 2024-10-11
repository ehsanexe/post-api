import 'dotenv/config'
import express from "express";

const app = express();

app.use("/", (req, res) => {
  res.json({ test: "test" });
});

app.listen(process.env.PORT);
