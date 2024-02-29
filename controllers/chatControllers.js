import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // console.log("USer Id is :" + userId);
  if (!userId) {
    console.log("User Id Param Not Sent To Request");
    return res.status(401).send("Id not Found bro");
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //Id Of Logged In User
      { users: { $elemMatch: { $eq: userId } } }, //Id of User He Want To Access
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    console.log(isChat);
    try {
      res.send(isChat[0]);
    } catch (error) {
      throw new Error("Chat Not Found !!");
    }
  } else {
    var ChatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(ChatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(201).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChats = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name)
    return res.status(400).send({ message: "Please Fill All THe Fields" });
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group" });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newChatName } = req.body;
  console.log(newChatName);
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: newChatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    // console.log(updatedChat);
    res.json(updatedChat);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (added) {
    res.json(added);
  } else {
    res.status(404);
    throw new Error("Chat Not Found !!");
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (removed) {
    res.status(200);
    res.json(removed);
  } else {
    res.status(404);
    throw new Error("Chat Not Found !!");
  }
});

export const fetchChatById = asyncHandler(async (req, res) => {
  console.log("Hie");
  const { id } = req.params;
  console.log(req.body);
  try {
    const chat = await Chat.findById(id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(201).send(results);
      });
    if (chat) {
      console.log(chat);
      res.json(chat);
    }
    res.json({ message: "Chat Not Found", status: 404 });
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
});
