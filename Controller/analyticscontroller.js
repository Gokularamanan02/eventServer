const Registration = require("../models/Registration.js");

// ADMIN dashboard analytics
exports.dashboardStats = async (req, res) => {
  const totalRegistrations = await Registration.countDocuments();

  const popularEvents = await Registration.aggregate([
    { $group: { _id: "$event", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    totalRegistrations,
    popularEvents,
  });
};
