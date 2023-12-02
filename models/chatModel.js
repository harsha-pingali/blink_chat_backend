import mongoose, { Mongoose } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId, //ref to user model
        ref: "user", // name used in Mongoose Model
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message", // name used in Mongoose Model
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId, //ref to user model
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
