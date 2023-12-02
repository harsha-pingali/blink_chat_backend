import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { accessChat } from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(protect, accessChat); // for accessing or creating
// router.route("/").get(protect, frtchChats);
// router.route("/group").post(protect, createGroupChats);
// router.route("/rename").put(protect, renameGroup);
// router.route("/groupremove").put(protect.removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);

export default router;
