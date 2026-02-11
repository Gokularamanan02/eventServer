const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Example: Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
