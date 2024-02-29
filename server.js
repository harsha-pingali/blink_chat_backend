import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import morgan from "morgan";
import { Server } from "socket.io";
import messageRoutes from "./routes/messageRoutes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 7071;
app.use(cors());
app.use(express.json());
connectDB();

app.use(
  morgan(
    "dev"
    // {
    //   skip: function (req, res) {
    //     return res.statusCode < 400;
    //   },
    // }
  )
);

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id/", (req, res) => {
  const chatId = req.params.id;
  const singleChat = chats.find((item) => item._id === chatId);
  res.send(singleChat);
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const appServer = app.listen(
  port,
  console.log(`Server started on post ${port}`)
);

const io = new Server(appServer, {
  pingTimeout: 60000, // if there is no new message for a duration of 60s then connection closes
  cors: {
    origin: `${process.env.REACT_APP_BASE_URL}`,
  },
});

io.on("connection", (socket) => {
  console.log(`connected to socket.io : ${socket?.id}`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stoptyping", (room) => socket.in(room).emit("stoptyping"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
