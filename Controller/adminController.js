import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

/* ===========================
   ADMIN DASHBOARD STATS
=========================== */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
      popularEvents,
      events,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Event.countDocuments(),
      Registration.countDocuments(),
      Registration.countDocuments({ status: "pending" }),
      Registration.countDocuments({ status: "approved" }),
      Registration.aggregate([
        { $group: { _id: "$eventName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Event.find().select("category"),
    ]);

    // Calculate category breakdown
    const categoryCount = {};
    events.forEach((ev) => {
      const cat = ev.category || "General";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categories = Object.keys(categoryCount).map((cat) => ({
      name: cat,
      count: categoryCount[cat],
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        popularEvents,
        categories,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin stats",
      error: error.message,
    });
  }
};

/* ===========================
   GET ALL USERS
=========================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

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

/* ===========================
   DELETE USER
=========================== */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Also remove registrations of this user
    await Registration.deleteMany({ user: req.params.id });

    res.json({ success: true, message: "User and their registrations deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
