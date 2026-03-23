const mongoose = require('mongoose');

// --- Blog ---
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['news', 'match', 'announcement', 'community', 'achievement'],
    default: 'news'
  },
  summary: { type: String, maxlength: 300 },
  content: { type: String, required: true },
  coverImage: { url: String, publicId: String },
  author: { type: String, default: 'FYC Admin' },
  tags: [String],
  slug: String,
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

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
  Blog: mongoose.model('Blog', blogSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
  Gallery: mongoose.model('Gallery', gallerySchema),
  Contact: mongoose.model('Contact', contactSchema)
};
