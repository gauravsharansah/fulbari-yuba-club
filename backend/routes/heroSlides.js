const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect, adminOnly } = require('../middleware/auth');   // adjust path if needed
const { HeroSlide, HeroSettings } = require('../models/HeroSlide');

// ── Cloudinary config (uses the same env vars as your other routes) ───────────
// These should already be set in your .env:
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// If cloudinary is already configured globally elsewhere in your project you can
// remove the configure() call below.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer — Cloudinary storage ───────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'fyc-jakma/hero-slides',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      // Resize to a sensible hero size while keeping quality high
      { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' },
    ],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// ── Helper ────────────────────────────────────────────────────────────────────
const respond = (res, status, data) => res.status(status).json(data);

// ═════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/hero-slides
// Returns all active slides ordered by `order` asc, then createdAt desc
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true })
      .sort({ order: 1, createdAt: -1 });
    respond(res, 200, { success: true, data: slides });
  } catch (err) {
    console.error('GET /hero-slides error:', err);
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

// GET /api/hero-slides/settings
// Returns the global slideshow settings doc (creates default if missing)
router.get('/settings', async (req, res) => {
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) {
      settings = await HeroSettings.create({ interval: 5000 });
    }
    respond(res, 200, { success: true, data: settings });
  } catch (err) {
    console.error('GET /hero-slides/settings error:', err);
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN-ONLY ROUTES  (protect + adminOnly middleware)
// ═════════════════════════════════════════════════════════════════════════════

// POST /api/hero-slides
// Upload a new hero slide image
// Body (multipart/form-data): image (file), title (optional), caption (optional)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return respond(res, 400, { success: false, message: 'Image file is required' });
    }

    // multer-storage-cloudinary puts the Cloudinary URL in req.file.path
    // and the public_id in req.file.filename
    const slide = await HeroSlide.create({
      url:          req.file.path,
      cloudinaryId: req.file.filename,
      title:        req.body.title   || '',
      caption:      req.body.caption || '',
    });

    respond(res, 201, { success: true, data: slide });
  } catch (err) {
    console.error('POST /hero-slides error:', err);
    respond(res, 500, { success: false, message: err.message || 'Upload failed' });
  }
});

// PUT /api/hero-slides/settings
// Update slideshow interval
// Body: { interval: <number in ms> }
router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const { interval } = req.body;

    if (typeof interval !== 'number' || interval < 1000 || interval > 60000) {
      return respond(res, 400, {
        success: false,
        message: 'interval must be a number between 1000 and 60000 (ms)',
      });
    }

    // findOneAndUpdate with upsert so the doc is created if it doesn't exist
    const settings = await HeroSettings.findOneAndUpdate(
      {},
      { interval },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    respond(res, 200, { success: true, data: settings });
  } catch (err) {
    console.error('PUT /hero-slides/settings error:', err);
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

// DELETE /api/hero-slides/:id
// Delete a slide (also removes the image from Cloudinary)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return respond(res, 404, { success: false, message: 'Slide not found' });
    }

    // Remove image from Cloudinary if we stored the public_id
    if (slide.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(slide.cloudinaryId);
      } catch (cloudErr) {
        // Log but don't fail the request if Cloudinary delete fails
        console.warn('Cloudinary delete warning:', cloudErr.message);
      }
    }

    await slide.deleteOne();
    respond(res, 200, { success: true, message: 'Slide deleted' });
  } catch (err) {
    console.error('DELETE /hero-slides/:id error:', err);
    respond(res, 500, { success: false, message: 'Server error' });
  }
});

module.exports = router;