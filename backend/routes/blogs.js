// routes/blogs.js
const express = require('express');
const router = express.Router();
const { Blog } = require('../models/Other');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

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
    const coverImage = req.file ? { url: req.file.path, publicId: req.file.filename } : undefined;
    const blog = await Blog.create({ ...req.body, coverImage, createdBy: req.user._id });
    res.status(201).json({ success: true, data: blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, upload.single('coverImage'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.coverImage = { url: req.file.path, publicId: req.file.filename };
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
