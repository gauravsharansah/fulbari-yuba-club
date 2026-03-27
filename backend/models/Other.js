const mongoose = require('mongoose');

// --- Certificate ---
const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  yearBS: String,
  yearAD: String,
  category: {
    type: String,
    enum: ['trophy', 'certificate', 'award', 'recognition'],
    default: 'certificate'
  },
  icon: { type: String, default: '🏆' },
  description: String,
  image: { url: String, publicId: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// --- Gallery ---
const gallerySchema = new mongoose.Schema({
  title: String,
  url: { type: String, required: true },
  publicId: String,
  caption: String,
  category: {
    type: String,
    enum: ['match', 'event', 'training', 'community', 'cultural', 'other'],
    default: 'other'
  },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const noticeSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  category: { type: String, enum: ['general','event','urgent','meeting','sports'], default: 'general' },
  priority: { type: String, enum: ['high','normal','low'], default: 'normal' },
  author:   { type: String, default: 'FYC Admin' },
  body:     { type: String, required: true },
  featured: { type: Boolean, default: false },
  status:   { type: String, enum: ['active','archived'], default: 'active' },
  expiresAt:{ type: Date, default: null },
}, { timestamps: true });

// --- Contact Message ---
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  subject: String,
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = {
  Notice: mongoose.model('Notice', noticeSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
  Gallery: mongoose.model('Gallery', gallerySchema),
  Contact: mongoose.model('Contact', contactSchema)
};
