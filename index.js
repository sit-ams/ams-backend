import dotenv from "dotenv";

import logger from "./utils/logger.js";
import app from "./config/server.js";

dotenv.config();

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
});
