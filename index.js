const dotenv = require("dotenv");

const logger = require("./utils/logger.js");
const app = require("./config/server.js");
const db = require("./models/index.js");

dotenv.config();

app.listen(process.env.PORT, async () => {
  logger.info(`Connecting Database`);
  await db.sequelize.authenticate();
  await db.sequelize.sync({ alter: true });
  logger.info(`Database Connection Established`);
  logger.info(`Server is running on port ${process.env.PORT}`);
});
