'use strict';

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    headline: { type: String, required: true, maxlength: 80, trim: true },
    body:     { type: String, required: true, maxlength: 300, trim: true },
    type:     {
      type: String,
      enum: ['informational', 'urgent', 'found_batch'],
      default: 'informational',
    },
    archived:    { type: Boolean, default: false },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
