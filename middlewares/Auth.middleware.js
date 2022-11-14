const createError = require("http-errors");
const bcrypt = require("bcrypt");
const db = require("../models/index.js");
const User = db.User;

const sequelize = db.sequelize;

/**
 * token = {
 *      generatedAt: Date.now(),
 *      type: Enum(["admin" || "faculty" || "student"]),
 *      userId: Integer
 * }
 */

exports.auth = async (req, res, next) => {
  try {
    await sequelize.transaction(async (transaction) => {
      // Check if token is present in the request
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
      if (token) {
        // Check if token is valid
        const tokenData = bcrypt.compare(token, process.env.JWT_SECRET_KEY);
        if (tokenData) {
          // verify if user exists for given tokens
          const user = await User.findOne({
            where: {
              id: tokenData.userId,
              type: tokenData.type,
            },
            transaction,
          });

          if (user) {
            // Set user in request object
            req.user = user;
            req.tokenData = tokenData;
            next();
          } else {
            next(createError(401, "Invalid Token"));
          }
        } else {
          throw createError(401, "Unauthorized");
        }
      } else {
        next(createError(401, "Unauthorized"));
      }
    });
  } catch (err) {
    next(createError(500, err.message || "Internal Server Error"));
  }
};
