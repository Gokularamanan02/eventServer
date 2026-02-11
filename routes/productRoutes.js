// routes/Eventroutes.js
const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerEvent,
} = require("../Controller/Eventcontroller");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/* ===========================
   EVENT CRUD ROUTES
=========================== */
// Public
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Admin Only
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

/* ===========================
   EVENT REGISTRATION
=========================== */
router.post("/:id/register", authMiddleware, registerEvent);

module.exports = router;
