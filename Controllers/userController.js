const express = require("express");
const UserModel = require("../modals/userModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../Config/generateToken");

// #########################################
// login process
// #########################################
const loginController = expressAsyncHandler(async (req, res) => {
  //console.log(req.body);
  const { name, password } = req.body;
  const user = await UserModel.findOne({ name });

  //console.log("Fetched user data ", user);

  if (user && (await user.matchPassword(password))) {
    res.send({
      _id: user._id,
      name: user.name,
      email: user.emaul,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Invalid userName or Password");
  }
});

// #########################################
// registration process
// #########################################

const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //   check all fields
  if (!name || !email || !password) {
    res.send(400);
    throw Error("All input fields are not filled!");
  }

  //pre-existing user=> for this we need userModal to search
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    res.send(405);
    throw Error("Email Already in use");
  }

  // user name already existed
  const userNameExists = await UserModel.findOne({ name });
  if (userNameExists) {
    res.send(406);

    throw Error("Username Already taken");
  }

  //   Creating entry to database
  const user = await UserModel.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Registration Error");
  }
});

// using mongo expressions
// fetches all the users that are currently registered to our app
const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  //console.log("Now in fectch controller fn");
  // making small query
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // ne = not equal
  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = {
  loginController,
  registerController,
  fetchAllUsersController,
};
