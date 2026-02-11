// seed/seedEvents.js
import Event from "../models/Event.js";
import mongoose from "mongoose";

// Sample default events
const defaultEvents = [
  {
    title: "React Workshop",
    description: "Learn React basics and advanced patterns.",
    date: new Date("2026-02-10"),
    time: "10:00 AM",
    venue: "Auditorium 1",
    image: "https://via.placeholder.com/300x200",
    createdBy: new mongoose.Types.ObjectId(), // Replace with admin user ID
  },
  {
    title: "Node.js Bootcamp",
    description: "Hands-on Node.js training for beginners.",
    date: new Date("2026-02-15"),
    time: "2:00 PM",
    venue: "Lab 3",
    image: "https://via.placeholder.com/300x200",
    createdBy: new mongoose.Types.ObjectId(), // Replace with admin user ID
  },
];

const seedEvents = async () => {
  try {
    const count = await Event.countDocuments();

    if (count === 0) {
      await Event.insertMany(defaultEvents);
      console.log("Default events seeded successfully");
    } else {
      console.log("Events already exist, skipping seeding");
    }
  } catch (err) {
    console.error("Error seeding events:", err);
  }
};

export default seedEvents;
