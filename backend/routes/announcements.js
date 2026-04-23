'use strict';
const { protect, adminOnly } = require('../middleware/authMiddleware');

const express  = require('express');
const router   = express.Router();

const Announcement = require('../models/Announcement');
const User         = require('../models/User');

// GET /api/announcements  — public (for the banner)
router.get('/', async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  res.json({ announcements });
});

// POST /api/announcements  — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  const { headline, body, type } = req.body;
  if (!headline || !body) {
    return res.status(400).json({ message: 'headline and body are required' });
  }

  // Count eligible recipients
  const recipientCount = await User.countDocuments({ role: 'student', banned: { $ne: true } });

  const announcement = await Announcement.create({
    headline,
    body,
    type: type || 'informational',
    createdBy: req.user.id,
    recipientCount,
  });

  // NOTE: Email sending would be triggered here via the email service.
  // Keeping it as a stub to avoid breaking existing email infrastructure.
  // emailService.sendBroadcast(announcement);

  res.status(201).json({ announcement });
});

// PATCH /api/announcements/:id/archive  — admin only
router.patch('/:id/archive', protect, adminOnly, async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    { archived: true },
    { new: true }
  );
  if (!announcement) return res.status(404).json({ message: 'Not found' });
  res.json({ announcement });
});

module.exports = router;
