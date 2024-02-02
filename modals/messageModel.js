const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    createdAt: {
      type: Date, // Store the timestamp for when the message was created
    },
  },
  {
    timestamps: true,
  }
);

messageModel.pre("save", function (next) {
  // Set the createdAt field before saving the message
  const dateUTC = new Date();
  const dateIST = new Date(
    dateUTC.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
  ); // Shifting to IST (+5 hours and 30 minutes)
  this.createdAt = dateIST;
  next();
});

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
