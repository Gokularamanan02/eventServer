const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Example: Admin dashboard info
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ success: true, message: "Admin dashboard data" });
});

module.exports = router;
