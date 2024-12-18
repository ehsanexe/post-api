import "dotenv/config";
import express from "express";
import { setHeaders } from "./middlewares/setHeaders.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { fileURLToPath } from "url";
import { dirname } from "path";
import schema from "./graphql/schema.js";
import { root } from "./graphql/resolvers.js";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import { isAuth } from "./middlewares/auth.js";
import { upload } from "./middlewares/multer.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(upload.single("image"));
// app.use(bodyParser.json());
app.use(setHeaders); // to allow CORS

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.put("/saveimage", (req, res) => {
  const authData = isAuth(req);

  const imageUrl = req.file.path;

  if (!authData.isAuth) {
    return res.status(401).json({ message: "Authentication failed!" });
  }

  if (imageUrl) {
    if (req.body?.oldPath) {
      clearFile(re1.body?.oldPath);
    }
    return res.status(201).json({ imageUrl: imageUrl.replace("\\", "/"), message: "Image stored" });
  }
  if (!imageUrl) {
    return res.status(200).json({ imageUrl, message: "No image provided" });
  }
});

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: root,
    graphiql: true,
    formatError: (error) => ({
      message: error.message || "An error occurred.",
      code: error.originalError.code || 500,
      data: error.originalError.data,
    }),
    context: (req) => {
      const authData = isAuth(req);
      return { ...authData, ...req };
    },
  })
);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("connected");
  })
  .catch((err) => console.log(err));

const clearFile = (filePath) => {
  const delPath = path.join(__dirname, filePath);
  fs.unlink(delPath, (err) => {
    if (err) throw err;
  });
};
