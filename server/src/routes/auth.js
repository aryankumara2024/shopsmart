/**
 * Auth Routes — Signup, Login, Profile
 *
 * POST /api/auth/signup   — Create a new account
 * POST /api/auth/login    — Log in and receive JWT
 * GET  /api/auth/profile  — Get current user profile (protected)
 * PUT  /api/auth/profile  — Update profile (protected)
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { authenticate, generateToken } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

/** POST /api/auth/signup */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Validation error', message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Validation error', message: 'Password must be at least 6 characters.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Validation error', message: 'Please provide a valid email address.' });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({ error: 'Conflict', message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword },
    });

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    res.status(201).json({ message: 'Account created successfully', user: safeUser, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error', message: 'Something went wrong.' });
  }
});

/** POST /api/auth/login */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Validation error', message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed', message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Authentication failed', message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    res.json({ message: 'Login successful', user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error', message: 'Something went wrong.' });
  }
});

/** GET /api/auth/profile */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'Not found', message: 'User not found.' });
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Internal server error', message: 'Something went wrong.' });
  }
});

/** PUT /api/auth/profile */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name && { name: name.trim() }) },
    });
    const { password: _, ...safeUser } = user;
    res.json({ message: 'Profile updated', user: safeUser });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found', message: 'User not found.' });
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error', message: 'Something went wrong.' });
  }
});

module.exports = router;
