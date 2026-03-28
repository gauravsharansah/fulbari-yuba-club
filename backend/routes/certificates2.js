const express = require('express');
const router = express.Router();
const { Certificate } = require('../models/Other');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { syncCertificates } = require('../utils/syncStatic');

router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find({}).sort('-createdAt');
    res.json({ success: true, data: certs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    let image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = { url: result.secure_url, publicId: result.public_id };
    }
    const cert = await Certificate.create({ ...req.body, image });
    await syncCertificates(Certificate);
    res.status(201).json({ success: true, data: cert });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT now also handles image replacement
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      update.image = { url: result.secure_url, publicId: result.public_id };
    }
    const cert = await Certificate.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!cert) return res.status(404).json({ success: false, message: 'Not found' });
    await syncCertificates(Certificate);
    res.json({ success: true, data: cert });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Not found' });

    // const diffDays = (new Date() - new Date(cert.createdAt)) / (1000 * 60 * 60 * 24);
    // if (diffDays > 5) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'This award was added more than 5 days ago and can only be removed from the codebase.',
    //     cannotDelete: true,
    //     daysOld: Math.floor(diffDays),
    //   });
    // }

    await Certificate.findByIdAndDelete(req.params.id);
    await syncCertificates(Certificate);
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;