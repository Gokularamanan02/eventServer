import express from "express";
import {
  createRegistration,
  getMyRegistrations,
  updateRegistrationStatus,
} from "../controllers/registrationController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User registers for event
router.post("/events/:eventId/register", protect, createRegistration);

// User gets their registrations
router.get("/registrations/me", protect, getMyRegistrations);

// Admin updates registration status
router.put("/registrations/:id/status", protect, adminOnly, updateRegistrationStatus);

export default router;
