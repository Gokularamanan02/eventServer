const User = require("../models/User.js");
const Event = require("../models/Event.js");
const Registration = require("../models/Registration.js");

/* ===========================
   ADMIN DASHBOARD
=========================== */
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message,
    });
  }
};

/* ===========================
   GET ALL USERS
=========================== */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
