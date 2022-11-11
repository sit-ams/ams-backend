import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import v1 from "../api/v1/index.js";

import logger from "../utils/logger.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/api/v1", v1);

app.get("/", (req, res) => {
  logger.info("Inside the GET / route");
  res.send({ status: true, message: "Server is up" });
});

app.use("*", (req, res) => {
  logger.error(`404 - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(400).send({ status: false, message: "Not Found" });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500);
  res.send({
    status: false,
    enviroment: process.env.MODE || "production",
    message:
      err.status === 403
        ? err.message
        : process.env.MODE === "development"
        ? err.message
        : "Error Occoured",
  });
});

export default app;
