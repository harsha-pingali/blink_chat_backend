import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import { sendEmailReg, sendResetMail } from "../services/emailService.js";
import otpUtility from "../config/genOtp.js";
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
    sendEmailReg(user);
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

export const authUser = asyncHandler(async (req, res) => {
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
    } else {
      console.log("In correct password");
      res.status(404).json({
        text: "Invalid credentials..",
      });
    }
  } catch (error) {
    // Handle errors and send an appropriate response
    throw new Error("Invalid Login Try Again!!");
  }
});

//as we are using get request we use query  to search an user
// ${base_url}/api/user?search=harsha
export const allUsers = asyncHandler(async (req, res) => {
  /*as we are taking query we use req.query
  if it is param (/api/user/:id) we use req.params*/

  const keyWord = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  /*$or ,$regex and $options are Mongodb Methods*/
  //console.log(keyWord);
  const users = await User.find(keyWord).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("email " + email);
  if (email) {
    const userData = await User.findOne({ email: email });
    // console.log(userData);
    const otp = await otpUtility();
    // console.log("otp " + otp);
    const params = {
      email: email,
      reqForReset: true,
      userData: userData,
      otp: otp,
    };
    try {
      await sendResetMail(params);
      res.status(200).json({
        mailSent: true,
        email: email,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "Not Found",
    });
  }
});
