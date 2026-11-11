import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "mern_secret_key",
    { expiresIn: "7d" }
  );
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    // Model pre('save') hashes password if not hashed, or we can save directly
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === "admin" ? "admin" : "user",
    });
    await user.save();

    const token = generateToken(user);

    const userPayload = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user);

    const userPayload = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

// GET CURRENT USER (/api/auth/me)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user data" });
  }
};
