const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const members = await User.find({ role: 'member', isActive: true }).select('-password').sort('name');
    res.json({ success: true, data: members });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
