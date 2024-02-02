const express = require("express");
const {
  loginController,
  registerController,
  fetchAllUsersController,
} = require("../Controllers/userController");

// from authMiddleware
const { protect } = require("../Middlewares/authMiddleware");

const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register", registerController);
// we can access this route iff we are authrized to do so
// this auth middleware is protected
// if need to access this route (in User.js) , need to provide bearer token=> inside USer.js
Router.get("/fetchUsers", protect, fetchAllUsersController);

module.exports = Router;
