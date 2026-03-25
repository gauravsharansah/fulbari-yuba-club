const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signToken, protect, adminOnly } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Find user (case-insensitive email)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log(`Login failed: no user found for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
      console.log(`Login failed: wrong password for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    const token = signToken(user._id);
    console.log(`Login success: ${email} (${user.role})`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// GET /api/auth/users (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/users (admin creates user/admin)
router.post('/users', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, phone, position, jerseyNumber, memberSince } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password required' });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({
      name, email: email.toLowerCase().trim(),
      password, role: role || 'member',
      phone, position, jerseyNumber, memberSince
    });

    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/users/:id (admin)
router.put('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/auth/users/:id (admin)
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/force-seed — emergency endpoint to reseed admin (use once then remove)
router.post('/force-seed', async (req, res) => {
  try {
    const { secret } = req.body;
    if (secret !== process.env.SEED_SECRET) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const email = process.env.ADMIN_EMAIL || 'admin@fycjakma.com';
    const password = process.env.ADMIN_PASSWORD || 'FYC@Admin2057!';
    const name = process.env.ADMIN_NAME || 'FYC Admin';

    // Delete existing admin and recreate with fresh password hash
    await User.deleteOne({ email: email.toLowerCase() });
    const admin = await User.create({ name, email: email.toLowerCase(), password, role: 'admin' });

    res.json({ success: true, message: `Admin reseeded: ${admin.email}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
