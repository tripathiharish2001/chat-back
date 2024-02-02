const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String },
    isGroupChat: { type: Boolean },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date, // Store the timestamp for when the message was created
    },
  },
  {
    timestamps: true,
  }
);

chatModel.pre("save", function (next) {
  const dateUTC = new Date();
  const dateIST = new Date(
    dateUTC.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
  ); // Shifting to IST (+5 hours and 30 minutes)
  this.createdAt = dateIST;
  next();
});

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;
