const express  = require('express');
const router   = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { HeroSlide, HeroSettings } = require('../models/HeroSlide');
const { upload, uploadToCloudinary, cloudinary } = require('../config/cloudinary');

const respond = (res, status, data) => res.status(status).json(data);

// ── PUBLIC ────────────────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: -1 });
    respond(res, 200, { success: true, data: slides });
  } catch (err) {
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

router.get('/settings', async (req, res) => {
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) settings = await HeroSettings.create({ interval: 5000 });
    respond(res, 200, { success: true, data: settings });
  } catch (err) {
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

// ── ADMIN ─────────────────────────────────────────────────────────────────────

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file)
      return respond(res, 400, { success: false, message: 'Image file is required' });

    const result = await uploadToCloudinary(req.file.buffer, 'fyc-jakma/hero-slides');

    const slide = await HeroSlide.create({
      url:          result.secure_url,
      cloudinaryId: result.public_id,
      title:        req.body.title   || '',
      caption:      req.body.caption || '',
    });

    respond(res, 201, { success: true, data: slide });
  } catch (err) {
    respond(res, 500, { success: false, message: err.message || 'Upload failed' });
  }
});

router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const { interval } = req.body;
    if (typeof interval !== 'number' || interval < 1000 || interval > 60000)
      return respond(res, 400, { success: false, message: 'interval must be between 1000 and 60000 ms' });

    const settings = await HeroSettings.findOneAndUpdate(
      {}, { interval }, { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    respond(res, 200, { success: true, data: settings });
  } catch (err) {
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return respond(res, 404, { success: false, message: 'Slide not found' });

    if (slide.cloudinaryId) {
      try { await cloudinary.uploader.destroy(slide.cloudinaryId); }
      catch (e) { console.warn('Cloudinary delete warning:', e.message); }
    }

    await slide.deleteOne();
    respond(res, 200, { success: true, message: 'Slide deleted' });
  } catch (err) {
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

module.exports = router;