const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const JWT_SECRET = "shadowindali";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      throw new Error("Not Authorized, token failed!");
    }
  }
  if (!token) {
    throw new Error("Not Authorized, token failed!");
  }
});

module.exports = { protect };
