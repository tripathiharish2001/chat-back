const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timeStamp: true,
  }
);

// matched password method
userModel.methods.matchPassword = async function (enteredPassword) {
  const passwordMatched = await bcrypt.compare(enteredPassword, this.password);
  return passwordMatched;
};

// middleware to encrypt password
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userModel);
module.exports = User;
