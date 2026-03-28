'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Subdocument: individual match result ────────────────────────────────────

const MatchEntrySchema = new Schema(
  {
    matchedPostId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    breakdown: {
      categoryScore: { type: Number, default: 0 },
      zoneScore:     { type: Number, default: 0 },
      dateScore:     { type: Number, default: 0 },
    },

    matchedPostSnapshot: {
      title:        { type: String },
      category:     { type: String },
      zone:         { type: String },
      incidentDate: { type: Date },
      imageUrls:    { type: [String] },
      authorId:     { type: Schema.Types.ObjectId },
      status:       { type: String },
    },
  },
  { _id: false } // no _id on subdocuments
);

// ─── Root Schema ──────────────────────────────────────────────────────────────

const MatchScoreCacheSchema = new Schema(
  {
    sourcePostId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      unique: true,
      index: true,
    },

    matches: {
      type: [MatchEntrySchema],
      default: [],
    },

    cachedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  },
  { timestamps: false, versionKey: false }
);

// ─── TTL Index ────────────────────────────────────────────────────────────────
// MongoDB will auto-delete documents when expiresAt < current time.

MatchScoreCacheSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'cache_ttl_expiry' }
);

// ─── Export ───────────────────────────────────────────────────────────────────

module.exports = mongoose.model('MatchScoreCache', MatchScoreCacheSchema);
