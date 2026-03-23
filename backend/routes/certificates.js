const express = require('express');
const router = express.Router();
const { Certificate } = require('../models/Other');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find({}).sort('-createdAt');
    res.json({ success: true, data: certs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const image = req.file ? { url: req.file.path, publicId: req.file.filename } : undefined;
    const cert = await Certificate.create({ ...req.body, image });
    res.status(201).json({ success: true, data: cert });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: cert });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
