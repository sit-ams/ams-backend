const express = require("express");
const { body } = require("express-validator");

const authController = require("../../../controllers/auth.controller.js");
const auth = require("../../../middlewares/Auth.middleware.js");

const router = express.Router();

// @route   POST api/v1/auth/login/student
router.post(
  "/login/student",
  [
    body("prn").notEmpty().withMessage("Invalid PRN"),
    body("password")
      .isLength({ min: 8 })
      .isStrongPassword()
      .withMessage("Strong password must be at least 8 characters long"),
  ],
  authController.studentLogin
);

// @route   POST api/v1/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 8 })
      .isStrongPassword()
      .withMessage("Strong password must be at least 8 characters long"),
  ],
  authController.login
);

// @route   POST api/v1/auth/register/student
router.post(
  "/register/student",
  [
    body("fullName").notEmpty().withMessage("Invalid Full Name"),
    body("prn").notEmpty().withMessage("Invalid PRN"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 8 })
      .isStrongPassword()
      .withMessage("Password must be strong"),
    body("phone").notEmpty().withMessage("Invalid Phone Number"),
    body("address").notEmpty().withMessage("Invalid Address"),
    auth(["admin"]),
  ],
  authController.studentRegister
);

// @route   POST api/v1/auth/register/
router.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("Invalid Full Name"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 8 })
      .isStrongPassword()
      .withMessage("Password must be strong"),
    body("phone").notEmpty().withMessage("Invalid Phone Number"),
    body("address").notEmpty().withMessage("Invalid Address"),
    auth(["admin"]),
  ],
  authController.register
);

module.exports = router;
