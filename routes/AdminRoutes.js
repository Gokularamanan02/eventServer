import express from "express";
import {
  getAdminStats,
  getAllUsers,
  deleteUser,
} from "../Controller/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
