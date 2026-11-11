import express from "express";
import { signup, login, getMe } from "../Controller/Authcontroller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
