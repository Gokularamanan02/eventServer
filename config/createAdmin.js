// createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // adjust path if needed

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Admin details
const adminData = {
  name: "Admin",
  email: "admin@example.com",
  password: "admin123", // plaintext, will be hashed
  isAdmin: true,
};

async function createAdmin() {
  try {
    // Check if admin already exists
    const exists = await User.findOne({ email: adminData.email });
    if (exists) {
      console.log("Admin user already exists!");
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const admin = new User({
      ...adminData,
      password: hashedPassword,
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error creating admin:", err);
    mongoose.connection.close();
  }
}

createAdmin();
