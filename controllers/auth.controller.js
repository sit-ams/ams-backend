const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../models/index.js");
const Op = db.Sequelize.Op;
const User = db.User;
const UserActivity = db.UserActivity;
const sequelize = db.sequelize;

exports.studentRegister = async (req, res, next) => {
  try {
    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors[0]));
    }
    await sequelize.transaction(async (transaction) => {
      const { fullName, prn, email, password, phone, address } = req.body;

      const studentData = {
        fullName,
        prn,
        email,
        type: "student",
        phone,
        address,
      };

      const studentPassword = bcrypt.hashSync(password, 10);

      studentData.password = studentPassword;

      const student = await User.create(studentData, { transaction });

      if (student) {
        // generate token
        const token = jwt.sign(
          {
            userId: student.id,
            type: student.type,
            generatedAt: Date.now(),
          },
          process.env.JWT_SECRET
        );
        res.status(200).send({
          status: true,
          message: "Registration Successful",
          data: {
            token: token,
          },
        });
      } else {
        return next(createError(400, "Registration Failed"));
      }
    });
  } catch (err) {
    return next(createError(500, err.message || "Internal Server Error"));
  }
};

exports.studentLogin = async (req, res, next) => {
  try {
    // check for validation errors
    if (!validationResult(req).isEmpty()) {
      return next(createError(400, "Invalid Request"));
    }
    await sequelize.transaction(async (transaction) => {
      const { prn, password } = req.body;

      if (prn && password) {
        // check if user exists or not
        const user = await User.findOne({
          where: {
            prn: prn,
            type: "student",
          },
          transaction,
        });

        if (user) {
          // compare password
          const isPasswordMatch = bcrypt.compareSync(password, user.password);
          if (isPasswordMatch) {
            // check if student is already logged in or not
            const loginDetail = await UserActivity.findOne({
              where: {
                userId: user.id,
                activity: "login",
              },
              transaction,
            });

            if (!loginDetail) {
              // create login activity

              const loginActivity = await UserActivity.create(
                {
                  userId: user.id,
                  activity: "login",
                },
                { transaction }
              );

              if (loginActivity) {
                // generate token
                const token = jwt.sign(
                  {
                    userId: user.id,
                    type: user.type,
                    generatedAt: Date.now(),
                  },
                  process.env.JWT_SECRET
                );
                res.status(200).send({
                  status: true,
                  message: "Login Successful",
                  data: {
                    token: token,
                  },
                });
              } else {
                return next(createError(400, "Student already logged in"));
              }
            } else {
              return next(createError(400, "Already Logged In"));
            }
          } else {
            return next(createError(400, "Invalid Credentials"));
          }
        } else {
          return next(createError(400, "Invalid Credentials"));
        }
      } else {
        return next(createError(400, "Payload insufficient"));
      }
    });
  } catch (err) {
    return next(createError(500, err.message || "Internal Server Error"));
  }
};

exports.register = async (req, res, next) => {
  try {
    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors[0]));
    }
    await sequelize.transaction(async (transaction) => {
      const { fullName, email, password, phone, address } = req.body;

      // generate user data object
      const userData = {
        fullName,
        email,
        type: "admin",
        phone,
        address,
      };

      // hash password
      const userPassword = bcrypt.hashSync(password, 10);

      // append hashed password to user data object
      userData.password = userPassword;

      // create user
      const user = await User.create(userData, { transaction });

      if (user) {
        // generate token
        const token = jwt.sign(
          {
            userId: user.id,
            type: user.type,
            generatedAt: Date.now(),
          },
          process.env.JWT_SECRET
        );
        res.status(200).send({
          status: true,
          message: "Registration Successful",
          data: {
            token: token,
          },
        });
      } else {
        return next(createError(400, "Registration Failed"));
      }
    });
  } catch (err) {
    return next(createError(500, err.message || "Internal Server Error"));
  }
};

exports.login = async (req, res, next) => {
  try {
    // check for validation errors
    if (!validationResult(req).isEmpty()) {
      return next(createError(400, "Invalid Request"));
    }
    await sequelize.transaction(async (transaction) => {
      const { email, password } = req.body;

      // check if user exists or not
      const user = await User.findOne({
        where: {
          email: email,
          type: {
            [Op.or]: ["admin", "faculty"],
          },
        },
        transaction,
      });

      if (user) {
        // compare password
        const isPasswordMatch = bcrypt.compareSync(password, user.password);
        if (isPasswordMatch) {
          // generate token
          const token = jwt.sign(
            {
              userId: user.id,
              type: user.type,
              generatedAt: Date.now(),
            },
            process.env.JWT_SECRET
          );
          res.status(200).send({
            status: true,
            message: "Login Successful",
            data: {
              token: token,
            },
          });
        } else {
          return next(createError(400, "Invalid Credentials"));
        }
      } else {
        return next(createError(400, "Invalid Credentials"));
      }
    });
  } catch (err) {
    return next(createError(500, err.message || "Internal Server Error"));
  }
};
