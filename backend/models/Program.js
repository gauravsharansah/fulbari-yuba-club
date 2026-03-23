const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['tournament', 'community', 'cultural', 'training', 'other'],
    required: true
  },
  date: { type: Date, required: true },
  endDate: Date,
  location: { type: String, default: 'Jakma, Okhaldhunga' },
  shortDesc: { type: String, required: true, maxlength: 300 },
  fullDesc: String,
  photos: [{ url: String, publicId: String, caption: String }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'past', 'draft'],
    default: 'upcoming'
  },
  organizer: { type: String, default: 'Fulbari Yuba Club Jakma' },
  participants: Number,
  prize: String,
  slug: String,
  featured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

programSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Program', programSchema);
