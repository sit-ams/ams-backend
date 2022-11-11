import express from "express";

import logger from "../../../utils/logger.js";

const router = express.Router();

router.get("/", (req, res) => {
  logger.info("Inside the GET /api/v1/ route");
  res.send({ status: true, message: "Hello World!" });
});

export default router;
