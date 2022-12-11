"use strict";

// const jest = require("jest");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const auth = require("../../middlewares/Auth.middleware.js");

dotenv.config();

describe("Auth middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  it("should return 401 if no token is provided", async () => {
    await auth("admin")(req, res, next);

    expect(next).toHaveBeenCalledWith(
      createError(401, "Access denied. No token provided.")
    );

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if invalid token is provided", async () => {
    const token = jwt.sign(
      {
        generatedAt: Date.now(),
        type: "admin",
        userId: 1,
      },
      "invalidSecret"
    );

    req.headers.authorization = `Bearer ${token}`;

    await auth("admin")(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(401, "Invalid Token"));
  });

  it("should return 401 if token is valid but role is empty", async () => {
    const token = jwt.sign(
      {
        generatedAt: Date.now(),
        type: "admin",
        userId: 1,
      },
      process.env.JWT_SECRET
    );

    req.headers.authorization = `Bearer ${token}`;

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(401, "Invalid Role"));
  });

  it("should return 401 if user id is invalid", async () => {
    const token = jwt.sign(
      {
        generatedAt: Date.now(),
        type: "admin",
        userId: 100000,
      },
      process.env.JWT_SECRET
    );

    req.headers.authorization = `Bearer ${token}`;

    await auth(["admin"])(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(401, "User not found"));
  });

  it("should return 401 if user type is invalid", async () => {
    const token = jwt.sign(
      {
        generatedAt: Date.now(),
        type: "invalid",
        userId: 1,
      },
      process.env.JWT_SECRET
    );

    req.headers.authorization = `Bearer ${token}`;

    await auth(["admin"])(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(401, "Invalid Role"));
  });

  it("should return 401 if user type is not in role array", async () => {
    const token = jwt.sign(
      {
        generatedAt: Date.now(),
        type: "faculty",
        userId: 1,
      },
      process.env.JWT_SECRET
    );

    req.headers.authorization = `Bearer ${token}`;

    await auth(["admin"])(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(401, "Invalid Role"));
  });

  it("should return 401 if user type is in role array but user is not found", async () => {
    const token = jwt.sign(
      {
        generatedAt: Date.now(),
        type: "admin",
        userId: 100000,
      },
      process.env.JWT_SECRET
    );

    req.headers.authorization = `Bearer ${token}`;

    await auth(["admin"])(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(401, "User not found"));
  });

  it("should insert user in req.user if token is valid and user is found", async () => {
    const token = jwt.sign(
      {
        generatedAt: Date.now(),
        type: "admin",
        userId: 1,
      },
      process.env.JWT_SECRET
    );

    req.headers.authorization = `Bearer ${token}`;

    await auth(["admin"])(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.token).toBeDefined();
    expect(req.user.id).toBe(1);
    expect(req.user.type).toBe("admin");
    expect(req.token).toBe(token);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
