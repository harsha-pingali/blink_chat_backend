import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
//Restful Services so we can write multiple type of request to a single URI
router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/").get(protect, allUsers); // This request must pass through protect middleware

export default router;
