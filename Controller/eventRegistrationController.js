exports.getAnalytics = async (req, res) => {
  const data = await EventRegistration.aggregate([
    {
      $group: {
        _id: "$eventName",
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
};
