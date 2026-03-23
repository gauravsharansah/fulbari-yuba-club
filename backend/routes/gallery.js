const express = require('express');
const router = express.Router();
const { Gallery } = require('../models/Other');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const photos = await Gallery.find(filter).sort('-createdAt').limit(50);
    res.json({ success: true, data: photos });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, upload.array('photos', 20), async (req, res) => {
  try {
    const docs = (req.files || []).map(f => ({
      url: f.path, publicId: f.filename,
      caption: req.body.caption, category: req.body.category || 'other',
      uploadedBy: req.user._id
    }));
    const photos = await Gallery.insertMany(docs);
    res.status(201).json({ success: true, data: photos });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Photo deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
