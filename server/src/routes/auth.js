/**
 * Auth Routes — Signup, Login, Profile
 *
 * POST /api/auth/signup   — Create a new account
 * POST /api/auth/login    — Log in and receive JWT
 * GET  /api/auth/profile  — Get current user profile (protected)
 * PUT  /api/auth/profile  — Update profile (protected)
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const store = require("../data/store");
const { authenticate, generateToken } = require("../middleware/auth");

const router = express.Router();

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Validation error",
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Validation error",
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Validation error",
        message: "Please provide a valid email address.",
      });
    }

    // Check if email already exists
    const existingUser = store.findOne(
      "users",
      (u) => u.email === email.toLowerCase(),
    );
    if (existingUser) {
      return res.status(409).json({
        error: "Conflict",
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.insertOne("users", user);

    // Generate JWT
    const token = generateToken(user);

    // Return user (without password) + token
    const { password: _, ...safeUser } = user;
    res.status(201).json({
      message: "Account created successfully",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong.",
    });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Validation error",
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = store.findOne("users", (u) => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateToken(user);

    // Return user (without password) + token
    const { password: _, ...safeUser } = user;
    res.json({
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong.",
    });
  }
});

/**
 * GET /api/auth/profile
 * Protected — requires JWT
 */
router.get("/profile", authenticate, (req, res) => {
  try {
    const user = store.findOne("users", (u) => u.id === req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not found", message: "User not found." });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong.",
    });
  }
});

/**
 * PUT /api/auth/profile
 * Protected — requires JWT
 * Body: { name } (optional fields to update)
 */
router.put("/profile", authenticate, (req, res) => {
  try {
    const { name } = req.body;

    const updatedUser = store.updateOne(
      "users",
      (u) => u.id === req.user.id,
      (user) => ({
        ...user,
        ...(name && { name: name.trim() }),
        updatedAt: new Date().toISOString(),
      }),
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "Not found", message: "User not found." });
    }

    const { password: _, ...safeUser } = updatedUser;
    res.json({ message: "Profile updated", user: safeUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong.",
    });
  }
});

module.exports = router;
