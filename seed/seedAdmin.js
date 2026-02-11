import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // make sure your User model exists
import bcrypt from "bcrypt";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("Admin user created:");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
