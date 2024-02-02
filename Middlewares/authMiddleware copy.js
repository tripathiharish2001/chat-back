const jwt = require("jsonwebtoken");
const User = require("../modals/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const objectIdString = decoded.id.data.reduce(
        (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
        ""
      );

      const userId = new mongoose.Types.ObjectId(objectIdString);

      req.user = await User.findById(userId).select("-password");

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
