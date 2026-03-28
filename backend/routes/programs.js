const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { syncPrograms } = require('../utils/syncStatic');

router.get('/', async (req, res) => {
  try {
    const { category, status, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [programs, total] = await Promise.all([
      Program.find(filter).sort('-date').skip(skip).limit(Number(limit)).populate('createdBy', 'name'),
      Program.countDocuments(filter),
    ]);
    res.json({ success: true, data: programs, total, page: Number(page) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('createdBy', 'name');
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Accept both coverImage (single) and photos (multiple) fields
router.post('/', protect, adminOnly,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'photos',     maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      let coverImage;
      if (req.files?.coverImage?.[0]) {
        const result = await uploadToCloudinary(req.files.coverImage[0].buffer);
        coverImage = { url: result.secure_url, publicId: result.public_id };
      }

      const photos = [];
      if (req.files?.photos?.length > 0) {
        for (const file of req.files.photos) {
          const result = await uploadToCloudinary(file.buffer);
          photos.push({ url: result.secure_url, publicId: result.public_id });
        }
      }

      const program = await Program.create({
        ...req.body,
        coverImage: coverImage || undefined,
        photos,
        createdBy: req.user._id,
      });

      await syncPrograms(Program);
      res.status(201).json({ success: true, data: program });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
);

router.put('/:id', protect, adminOnly,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'photos',     maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const update = { ...req.body };

      if (req.files?.coverImage?.[0]) {
        const result = await uploadToCloudinary(req.files.coverImage[0].buffer);
        update.coverImage = { url: result.secure_url, publicId: result.public_id };
      }

      if (req.files?.photos?.length > 0) {
        const newPhotos = [];
        for (const file of req.files.photos) {
          const result = await uploadToCloudinary(file.buffer);
          newPhotos.push({ url: result.secure_url, publicId: result.public_id });
        }
        update.$push = { photos: { $each: newPhotos } };
      }

      const program = await Program.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!program) return res.status(404).json({ success: false, message: 'Not found' });

      await syncPrograms(Program);
      res.json({ success: true, data: program });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
);

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Not found' });

    const diffDays = (new Date() - new Date(program.createdAt)) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      return res.status(403).json({
        success: false,
        message: 'This program was posted more than 5 days ago and can only be removed from the codebase.',
        cannotDelete: true,
        daysOld: Math.floor(diffDays),
      });
    }

    await Program.findByIdAndDelete(req.params.id);
    await syncPrograms(Program);
    res.json({ success: true, message: 'Program deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;