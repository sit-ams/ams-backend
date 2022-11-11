import express from "express";

import authRoutes from "./Auth/auth.route.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export default router;
