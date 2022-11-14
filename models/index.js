const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const logger = require("../utils/logger.js");
const dbCredentials = require("../config/database.config.js");

dotenv.config();

const env = process.env.MODE || "development";

const sequelize = new Sequelize(
  dbCredentials[env].database,
  dbCredentials[env].username,
  dbCredentials[env].password,
  {
    host: dbCredentials[env].host,
    port: dbCredentials[env].port,
    dialect: "postgres",
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User.model.js")(Sequelize, sequelize);
db.UserActivity = require("./User_Activity.model.js")(Sequelize, sequelize);

db.UserActivity.belongsTo(db.User, {
  foreignKey: "userId",
});

db.User.hasMany(db.UserActivity, {
  foreignKey: "userId",
});

module.exports = db;
