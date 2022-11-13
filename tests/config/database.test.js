const dotenv = require("dotenv");
const dbCredentials = require("../../config/database.config.js");

dotenv.config();

describe("Database", () => {
  it("should test enviroment to be test", () => {
    expect(process.env.NODE_ENV).toBe("development");
  });

  it("should test database config has all details", () => {
    expect(dbCredentials).toHaveProperty("development");
    expect(dbCredentials).toHaveProperty("production");
    expect(dbCredentials[process.env.NODE_ENV].username).toBeDefined();
    expect(dbCredentials[process.env.NODE_ENV].password).toBeDefined();
    expect(dbCredentials[process.env.NODE_ENV].database).toBeDefined();
    expect(dbCredentials[process.env.NODE_ENV].host).toBeDefined();
  });
});
