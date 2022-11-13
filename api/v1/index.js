const express = require("express");

const authRoutes = require("./Auth/auth.route.js");

const router = express.Router();

router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
