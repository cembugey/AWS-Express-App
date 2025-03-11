// src/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Example if token is in the Authorization header as Bearer token:
    const authHeader = req.headers.authorization;
    console.log("authMiddleware authHeader", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    console.log("authMiddleware authHeader", authHeader);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("authMiddleware decoded", decoded);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.log("authMiddleware error", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
