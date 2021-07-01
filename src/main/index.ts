
import express, { Express } from "express";
import config from "../config";
import bodyparser from "body-parser";
import MainRouter from "../routes/MainRoute"

const app = express();

app.use(bodyparser.json());
app.use(MainRouter);
app.set("json spaces", 2);
app.disable("x-powered-by");
app.use((req, res) => {
  res.status(400);
  res.json({ status: "ERROR", code: 400, cause: "Invalid Request" });
});

app.listen(config.port > 0 ? config.port : 8080, () => {
  console.log(`REST API Listening on ${config.port > 0 ? config.port : 8080}`);
});

export default config;
