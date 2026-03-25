const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { syncPrograms } = require('../utils/syncStatic');

// GET /api/programs
router.get('/', async (req, res) => {
  try {
    const { category, status, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [programs, total] = await Promise.all([
      Program.find(filter).sort('-date').skip(skip).limit(Number(limit)).populate('createdBy', 'name'),
      Program.countDocuments(filter)
    ]);
    res.json({ success: true, data: programs, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/programs/:id
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('createdBy', 'name');
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/programs (admin)
router.post('/', protect, adminOnly, upload.array('photos', 10), async (req, res) => {
  try {
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        photos.push({ url: result.secure_url, publicId: result.public_id });
      }
    }
    const program = await Program.create({ ...req.body, photos, createdBy: req.user._id });

    // Sync static data file for code reflection
    await syncPrograms(Program);

    res.status(201).json({ success: true, data: program });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/programs/:id (admin)
router.put('/:id', protect, adminOnly, upload.array('photos', 10), async (req, res) => {
  try {
    const newPhotos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        newPhotos.push({ url: result.secure_url, publicId: result.public_id });
      }
    }
    const update = { ...req.body };
    if (newPhotos.length > 0) update.$push = { photos: { $each: newPhotos } };
    const program = await Program.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!program) return res.status(404).json({ success: false, message: 'Not found' });

    await syncPrograms(Program);

    res.json({ success: true, data: program });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/programs/:id (admin) — only within 5 days
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Not found' });

    // 5-day rule: check how old the program entry is
    const now = new Date();
    const created = new Date(program.createdAt);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);

    if (diffDays > 5) {
      return res.status(403).json({
        success: false,
        message: 'This program was posted more than 5 days ago and can only be removed from the codebase.',
        cannotDelete: true,
        daysOld: Math.floor(diffDays),
      });
    }

    await Program.findByIdAndDelete(req.params.id);

    // Re-sync static file after deletion
    await syncPrograms(Program);

    res.json({ success: true, message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
