import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createRegistration,
  updateRegistrationStatus,
} from "../Controller/Eventcontroller.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========= EVENTS =========
router.get("/", protect, getEvents);
router.post("/", protect, adminOnly, createEvent);
router.get("/:id", protect, getEventById);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

// ========= REGISTRATION (EVENT-SPECIFIC) =========
router.post("/:eventId/register", protect, createRegistration);

router.put(
  "/:eventId/approve/:id",
  protect,
  adminOnly,
  (req, res, next) => {
    req.body.status = "approved";
    next();
  },
  updateRegistrationStatus
);

router.put(
  "/:eventId/reject/:id",
  protect,
  adminOnly,
  (req, res, next) => {
    req.body.status = "rejected";
    next();
  },
  updateRegistrationStatus
);

export default router;
