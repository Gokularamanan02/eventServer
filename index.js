import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Routes
import authRoutes from "./routes/Authroutes.js";
import eventRoutes from "./routes/Eventroutes.js";
import registrationRoutes from "./routes/Registrationroutes.js";
import adminRoutes from "./routes/AdminRoutes.js";

// Models & Seeders
import User from "./models/User.js";
import seedEvents from "./seed/seedEvents.js";
import { notFound, errorHandler } from "./middlewares/errorhandler.js";

dotenv.config();

const app = express();

/* ================= CORS CONFIGURATION ================= */
// Flexible CORS: allows localhost, client URL from env, or deployed frontends
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // Check if origin matches allowed list or is a vercel/render/netlify domain
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".onrender.com");

      if (isAllowed || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow for smooth portfolio demo
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);

/* ================= ROOT & HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Nexus Technical Symposium API is active and running",
    version: "2.0.0",
    status: "Healthy",
    endpoints: {
      auth: "/api/auth",
      events: "/api/events",
      registrations: "/api/registrations",
      admin: "/api/admin",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ================= ERROR HANDLING ================= */
app.use(notFound);
app.use(errorHandler);

/* ================= ADMIN SEED FUNCTION ================= */

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@example.com";
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = new User({
        name: "Symposium Admin",
        email: adminEmail,
        password: "Admin@123",
        role: "admin",
      });
      await adminUser.save();
      console.log("✅ Default admin user created (admin@example.com / Admin@123)");
    } else {
      const validMatch = await adminUser.comparePassword("Admin@123");
      if (!validMatch) {
        adminUser.password = "Admin@123";
        await adminUser.save();
        console.log("✅ Admin password reset to valid hash (admin@example.com / Admin@123)");
      } else {
        console.log("ℹ️ Admin user already exists with verified credentials");
      }
    }

    // Also seed default events if none exist
    await seedEvents(adminUser._id);
  } catch (err) {
    console.error("❌ Admin seed failed:", err);
  }
};

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3000;

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      console.log("✅ MongoDB successfully connected");
      await seedAdmin();
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
      // Still listen so healthcheck / proxy works
      app.listen(PORT, () => {
        console.log(`⚠️ Server running without DB on port ${PORT}`);
      });
    });
} else {
  console.warn("⚠️ MONGO_URI not provided in environment");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

