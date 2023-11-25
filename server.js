import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 7071;
app.use(cors());
app.use(express.json());
connectDB();

app.listen(port, console.log(`Server started on post ${port}`));

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
