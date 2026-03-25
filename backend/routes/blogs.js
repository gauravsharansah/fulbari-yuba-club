const express = require('express');
const router = express.Router();
const { Blog } = require('../models/Other');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { syncBlogs } = require('../utils/syncStatic');

router.get('/', async (req, res) => {
  try {
    const { category, status = 'published', limit = 20, page = 1 } = req.query;
    const filter = { status };
    if (category) filter.category = category;
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
      Blog.countDocuments(filter)
    ]);
    res.json({ success: true, data: blogs, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort('-createdAt');
    res.json({ success: true, data: blogs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    blog.views++;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, upload.single('coverImage'), async (req, res) => {
  try {
    let coverImage;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      coverImage = { url: result.secure_url, publicId: result.public_id };
    }
    const blog = await Blog.create({ ...req.body, coverImage, createdBy: req.user._id });
    await syncBlogs(Blog);
    res.status(201).json({ success: true, data: blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, upload.single('coverImage'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      update.coverImage = { url: result.secure_url, publicId: result.public_id };
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    await syncBlogs(Blog);
    res.json({ success: true, data: blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });

    const diffDays = (new Date() - new Date(blog.createdAt)) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      return res.status(403).json({
        success: false,
        message: 'This blog was posted more than 5 days ago and can only be removed from the codebase.',
        cannotDelete: true,
        daysOld: Math.floor(diffDays),
      });
    }

    await Blog.findByIdAndDelete(req.params.id);
    await syncBlogs(Blog);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
