const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.User;

const sequelize = db.sequelize;

/**
 * checks for the token in the request header for admin, faculty and student
 * token = {
 *      generatedAt: Date.now(),
 *      type: Enum(["admin" || "faculty" || "student"]),
 *      userId: Integer
 * }
 */

// role = ["admin", "faculty", "student"]
const authMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      await sequelize.transaction(async (transaction) => {
        // Check if token is present in the request
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (token) {
          // Check if token is valid
          let tokenData;
          try {
            tokenData = jwt.verify(token, process.env.JWT_SECRET);
          } catch (err) {
            return next(createError(401, "Invalid Token"));
          }
          if (tokenData) {
            // check if token.type is present in role array
            if (role && role.includes(tokenData.type)) {
              // verify if user exists for given tokens
              const user = await User.findOne({
                where: {
                  id: tokenData.userId,
                  type: tokenData.type,
                },
                transaction,
              });

              if (user) {
                // set user and token in request
                req.user = user;
                req.token = token;
                next();
              } else {
                return next(createError(401, "User not found"));
              }
            } else {
              return next(createError(401, "Invalid Role"));
            }
          } else {
            return next(createError(401, "Unauthorized"));
          }
        } else {
          return next(createError(401, "Access denied. No token provided."));
        }
      });
    } catch (err) {
      return next(createError(500, err.message || "Internal Server Error"));
    }
  };
};

module.exports = authMiddleware;
