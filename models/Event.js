import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      default: "Technical",
    },
    date: { type: Date, required: true },
    time: { type: String, default: "10:00 AM" },
    venue: { type: String, default: "Main Campus Auditorium" },
    image: { type: String, default: "" },
    capacity: { type: Number, default: 100 },
    ticketPrice: { type: Number, default: 0 },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    registrations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        college: { type: String, default: "" },
        department: { type: String, default: "" },
        year: { type: String, default: "" },
        phone: { type: String, default: "" },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);

