import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    res.status(400);
    throw new Error("Please Enter All Fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Unable To Create The User");
  }
});

export const authUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email + " " + password);
    const user = await User.findOne({ email });
    console.log("reached till email");
    if (user && (await user.verifyPassword(password))) {
      console.log("password verified");
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    // Handle errors and send an appropriate response
    throw new Error("Invalid Login Try Again!!");
  }
});
