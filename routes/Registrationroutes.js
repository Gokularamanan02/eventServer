import express from "express";
import {
  createRegistration,
  getMyRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from "../Controller/Registrationcontroller.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:eventId/register", protect, createRegistration);
router.get("/me", protect, getMyRegistrations);
router.get("/", protect, adminOnly, getAllRegistrations);

router.put("/:id/approve", protect, adminOnly, updateRegistrationStatus);
router.put("/:id/reject", protect, adminOnly, updateRegistrationStatus);

router.delete("/:id", protect, adminOnly, deleteRegistration);

export default router;
