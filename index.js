// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Routes
import authRoutes from "./routes/Authroutes.js";
import eventRoutes from "./routes/Eventroutes.js";
import registrationRoutes from "./routes/Registrationroutes.js";

// Models
import User from "./models/User.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ================= ADMIN SEED ================= */

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@example.com";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("ℹ️ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const adminUser = new User({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    console.log("✅ Admin user created");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: Admin@123");
  } catch (err) {
    console.error("❌ Admin seed failed:", err);
  }
};

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Seed admin once DB is ready
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
