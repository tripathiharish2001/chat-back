const jwt = require("jsonwebtoken");
const User = require("../modals/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // if auth header is present whose value is a string
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // than will extract JWT token
    try {
      token = req.headers.authorization.split(" ")[1];
      // token + secret
      // console.log("1. Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("2. Decoded:", decoded);

      // Convert the Buffer to ObjectId
      const objectIdString = decoded.id.data.reduce(
        (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
        ""
      );

      const userId = new mongoose.Types.ObjectId(objectIdString);
      // console.log("3. User ID (ObjectId):", userId);

      req.user = await User.findById(userId).select("-password");
      // console.log("4. User Data:", req.user);

      next();
    } catch (error) {
      console.error("Error during token verification:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
