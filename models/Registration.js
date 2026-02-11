import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: { type: String, required: true },
    department: { type: String },
    year: { type: String },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);
