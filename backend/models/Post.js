'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Schema Definition ────────────────────────────────────────────────────────

const PostSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },

    status: {
      type: String,
      enum: ['open', 'matched', 'resolved'],
      default: 'open',
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },

    category: {
      type: String,
      enum: ['Electronics', 'Clothing', 'Keys', 'ID Card', 'Other'],
      required: true,
    },

    zone: {
      type: String,
      enum: ['Library', 'Canteen', 'Lecture Halls', 'Labs'],
      required: true,
    },

    incidentDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return value <= new Date();
        },
        message: 'incidentDate must not be in the future.',
      },
    },

    imageUrls: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.length <= 3;
        },
        message: 'imageUrls must contain at most 3 items.',
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    matchCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastMatchedAt: {
      type: Date,
      default: null,
    },

    claimedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

PostSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 10, description: 5 }, name: 'post_text_search' }
);

PostSchema.index(
  { type: 1, category: 1, zone: 1, status: 1, isDeleted: 1 },
  { name: 'match_engine_compound' }
);

PostSchema.index(
  { status: 1, isDeleted: 1, createdAt: -1 },
  { name: 'browse_default_sort' }
);

PostSchema.index(
  { zone: 1, createdAt: 1 },
  { name: 'analytics_zone_date' }
);

PostSchema.index(
  { incidentDate: 1 },
  { name: 'incident_date_filter' }
);

// ─── Statics ──────────────────────────────────────────────────────────────────

PostSchema.statics.POST_TYPES = ['lost', 'found'];

PostSchema.statics.CATEGORIES = [
  'Electronics',
  'Clothing',
  'Keys',
  'ID Card',
  'Other',
];

PostSchema.statics.ZONES = ['Library', 'Canteen', 'Lecture Halls', 'Labs'];

PostSchema.statics.POST_STATUSES = ['open', 'matched', 'resolved'];

PostSchema.statics.ADJACENT_ZONES = {
  Library: ['Lecture Halls'],
  Canteen: ['Lecture Halls', 'Labs'],
  'Lecture Halls': ['Library', 'Canteen', 'Labs'],
  Labs: ['Canteen', 'Lecture Halls'],
};

// ─── Virtuals ─────────────────────────────────────────────────────────────────

PostSchema.virtual('daysOld').get(function () {
  return Math.floor(
    (Date.now() - this.incidentDate) / (1000 * 60 * 60 * 24)
  );
});

// ─── Export ───────────────────────────────────────────────────────────────────

module.exports = mongoose.model('Post', PostSchema);
