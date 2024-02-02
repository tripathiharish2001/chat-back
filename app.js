const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");
var path = require("path");

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

app.use(express.static(path.join(__dirname, "build")));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
  } catch (err) {}
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
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {});

  // temp
  socket.on("newMessage", (newMessageStatus) => {
    var chat = newMessageStatus?.chat;
    if (!chat || !chat?.users) {
      return alert("chats users not defined");
    }

    io.emit("refreshSidebar");

    chat.users.forEach((user) => {
      if (user._id === newMessageStatus.sender._id) return;
      socket.in(user._id).emit("messageReceived", newMessageStatus);
    });
  });
});
