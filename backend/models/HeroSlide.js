const mongoose = require('mongoose');

// ── HeroSlide ─────────────────────────────────────────────────────────────────
// Stores each homepage hero slideshow image uploaded via the admin panel.
const heroSlideSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    // Cloudinary public_id – used to delete the asset when the slide is removed
    cloudinaryId: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    // Controls display order — lower number shows first
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ── HeroSettings ──────────────────────────────────────────────────────────────
// Single-document settings collection (only one doc ever lives here).
const heroSettingsSchema = new mongoose.Schema(
  {
    // Interval between slides in milliseconds (default 5 000 ms = 5 s)
    interval: {
      type: Number,
      default: 5000,
      min: 1000,
      max: 60000,
    },
  },
  { timestamps: true }
);

const HeroSlide     = mongoose.model('HeroSlide',     heroSlideSchema);
const HeroSettings  = mongoose.model('HeroSettings',  heroSettingsSchema);

module.exports = { HeroSlide, HeroSettings };