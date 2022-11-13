// import { createLogger } from "bunyan";
const { createLogger } = require("bunyan");

const logger = createLogger({ name: "AMS - Logger" });

module.exports = logger;
