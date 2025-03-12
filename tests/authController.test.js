// tests/authController.test.js
const authController = require("../src/controllers/authController");
const prisma = require("../src/config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock the prisma client used in the controllers
jest.mock("../src/config/db");

describe("authController.register", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    req.body = { email: "", password: "" };
    console.log("authController.register req.body1", req.body);

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(407);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing email or password",
    });
  });

  it("should return 400 if user already exists", async () => {
    req.body = { email: "test@example.com", password: "123456" };
    console.log("authController.register req.body2", req.body);
    // Simulate that the user already exists
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@example.com",
    });

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  it("should create a new user if valid data is provided", async () => {
    req.body = { email: "new@example.com", password: "secret" };
    console.log("authController.register req.body3", req.body);
    // Simulate that the user does not exist
    prisma.user.findUnique.mockResolvedValue(null);

    // Mock bcrypt.hash to return a fake hash
    const fakeHash = "fakeHash";
    jest.spyOn(bcrypt, "hash").mockResolvedValue(fakeHash);

    // Simulate creating a user
    const createdUser = { id: 2, email: "new@example.com" };
    prisma.user.create.mockResolvedValue(createdUser);

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered",
      user: { id: createdUser.id, email: createdUser.email },
    });
  });
});

describe("authController.login", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    req.body = { email: "", password: "" };
    console.log("authController.login req.body1", req.body);
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing email or password",
    });
  });

  it("should return 401 if user is not found", async () => {
    req.body = { email: "notfound@example.com", password: "secret" };
    console.log("authController.login req.body2", req.body);
    prisma.user.findUnique.mockResolvedValue(null);

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should return 401 if password does not match", async () => {
    req.body = { email: "user@example.com", password: "wrongpass" };
    console.log("authController.login req.body3", req.body);
    const fakeUser = {
      id: 1,
      email: "user@example.com",
      password: "hashedPassword",
    };
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    // Simulate bcrypt.compare returning false
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should return a token if login is successful", async () => {
    req.body = { email: "user@example.com", password: "correctpass" };
    console.log("authController.login req.body4", req.body);
    const fakeUser = {
      id: 1,
      email: "user@example.com",
      password: "hashedPassword",
    };
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    // Simulate bcrypt.compare returning true
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    // Simulate jwt.sign returning a fake token
    const fakeToken = "fake.jwt.token";
    jest.spyOn(jwt, "sign").mockReturnValue(fakeToken);

    await authController.login(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Logged in",
      token: fakeToken,
    });
  });
});
