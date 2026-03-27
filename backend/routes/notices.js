const express = require('express');
const router = express.Router();
const { Notice } = require('../models/Other');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET all notices (public) ─────────────────────────────────────────────────
// Pinned/featured notices come first, then newest-first.
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ status: { $ne: 'archived' } })
      .sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET single notice (public) ───────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST create notice (admin only) ─────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, category, priority, author, body, featured, status } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required.' });
    }

    const notice = await Notice.create({
      title,
      category:  category  || 'general',
      priority:  priority  || 'normal',
      author:    author    || 'FYC Admin',
      body,
      featured:  featured  === true || featured === 'true',
      status:    status    || 'active',
    });

    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT update notice (admin only) ──────────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        // Coerce featured to boolean regardless of how it arrives
        ...(req.body.featured !== undefined && { featured: req.body.featured === true || req.body.featured === 'true' }),
      },
      { new: true, runValidators: true }
    );

    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE notice (admin only, within 5 days) ────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    const diffDays = (new Date() - new Date(notice.createdAt)) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      return res.status(403).json({
        success: false,
        message: 'This notice was posted more than 5 days ago and cannot be deleted.',
        cannotDelete: true,
        daysOld: Math.floor(diffDays),
      });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;