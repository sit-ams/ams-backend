const express = require("express");

const logger = require("../../../utils/logger.js");

const router = express.Router();

router.get("/", (req, res) => {
  logger.info("Inside the GET /api/v1/ route");
  res.send({ status: true, message: "Hello World!" });
});

module.exports = router;
