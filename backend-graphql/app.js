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
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use(bodyParser.json());
app.use(setHeaders); // to allow CORS

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
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
