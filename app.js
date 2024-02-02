// const express = require("express");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");

// routes
const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const { Server } = require("socket.io");

app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();

app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Server connected to DB");
  } catch (err) {
    console.log("Server not connected to DB ", err);
  }
};
connectDB();

// ROUTE
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("Listening to server......");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    // ye kaise kaam kiya?
    socket.join(user._id);
    socket.emit("connected");
    // console.log("setup");
  });

  socket.on("join chat", (room) => {
    console.log("join room");
    // socket.join(room);
    // console.log("ye join room mei hai ");
    // socket.emit("connected");
  });

  socket.on("newMessage", (newMessageStatus) => {
    var chat = newMessageStatus?.chat;
    console.log("inside send_message");
    if (!chat || !chat?.users) {
      return console.log("chats users not defined");
    }

    io.emit("refreshSidebar");

    chat.users.forEach((user) => {
      console.log("In newMessage");
      if (user._id === newMessageStatus.sender._id) return;
      socket.in(user._id).emit("messageReceived", newMessageStatus);
      console.log(user._id);
    });
  });
});
