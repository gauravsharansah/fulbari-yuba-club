const express = require('express');
const router = express.Router();
const { Contact } = require('../models/Other');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) return res.status(400).json({ success: false, message: 'Name and message required' });
    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find({}).sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
