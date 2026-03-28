'use strict';

/**
 * seedPosts.js — Populates the DB with 10 known posts for match-score testing.
 *
 * Score formula:
 *   categoryScore (max 40) + zoneScore (max 35) + dateScore (max 25) = max 100
 *
 * Date score bands:
 *   0 days apart  → 25
 *   1-2 days      → 15
 *   3-4 days      →  8
 *   5+ days       →  0
 *
 * Zone score:
 *   exact match   → 35
 *   adjacent zone → 18
 *   no match      →  0
 *
 * Expected pairs:
 *   Posts 1+2 → cat:40 + zone:35 + date:8  = 83  (above threshold)
 *   Posts 3+4 → cat:40 + zone:35 + date:25 = 100 (perfect)
 *   Posts 5+6 → cat:40 + zone:18 + date:0  = 58  (below threshold)
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Post = require('../models/Post');
const MatchScoreCache = require('../models/MatchScoreCache');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const oid = (hex) => new mongoose.Types.ObjectId(hex);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const posts = [
  // ── Pair 1: expected score 83 (cat:40 + zone:35 + date:8) ──────────────────
  {
    authorId:    oid('6601abc123def456789abcde'),
    type:        'lost',
    title:       'Black Sony earphones',
    description: 'Lost my black Sony WH-1000XM4 earphones somewhere in the Library building, last seen on the second floor study tables.',
    category:    'Electronics',
    zone:        'Library',
    incidentDate: daysAgo(3),
    status:      'open',
    isDeleted:   false,
  },
  {
    authorId:    oid('6601def456abc789012bcdef'),
    type:        'found',
    title:       'Found Sony headphones Library 3rd floor',
    description: 'Found a pair of black Sony wireless headphones on the third floor of the Library near the reading area. Please claim with proof.',
    category:    'Electronics',
    zone:        'Library',
    incidentDate: daysAgo(1),
    status:      'open',
    isDeleted:   false,
  },

  // ── Pair 2: expected score 100 (cat:40 + zone:35 + date:25) ────────────────
  {
    authorId:    oid('6602aaa111bbb222ccc3330a'),
    type:        'lost',
    title:       'Blue denim jacket',
    description: 'Left my blue slim-fit denim jacket on a chair near the Canteen main seating area today. Has a small patch on the left sleeve.',
    category:    'Clothing',
    zone:        'Canteen',
    incidentDate: today(),
    status:      'open',
    isDeleted:   false,
  },
  {
    authorId:    oid('6602bbb222ccc333ddd4440b'),
    type:        'found',
    title:       'Found denim jacket near canteen exit',
    description: 'Found a blue denim jacket with a sleeve patch left on a chair close to the Canteen exit door. Please contact me to identify and retrieve it.',
    category:    'Clothing',
    zone:        'Canteen',
    incidentDate: today(),
    status:      'open',
    isDeleted:   false,
  },

  // ── Pair 3: expected score 58 (cat:40 + zone:18 + date:0) — below threshold ─
  {
    authorId:    oid('6603ccc333ddd444eee5550c'),
    type:        'lost',
    title:       'Student ID card dropped',
    description: 'Dropped my university student ID card somewhere in the Lecture Halls block, possibly near Hall B or the corridor connecting to the main campus.',
    category:    'ID Card',
    zone:        'Lecture Halls',
    incidentDate: daysAgo(5),
    status:      'open',
    isDeleted:   false,
  },
  {
    authorId:    oid('6603ddd444eee555fff6660d'),
    type:        'found',
    title:       'Found ID card near Lab entrance',
    description: 'Found a student ID card on the floor just outside the main Lab entrance. The card belongs to a student from the Engineering Faculty. Come collect with verification.',
    category:    'ID Card',
    zone:        'Labs',
    incidentDate: daysAgo(4),
    status:      'open',
    isDeleted:   false,
  },

  // ── Posts 7–10: varied, all open and not deleted ───────────────────────────
  {
    authorId:    oid('6604eee555fff666aaa7770e'),
    type:        'lost',
    title:       'Silver house keys on blue keychain',
    description: 'Lost a set of silver house keys on a distinctive blue rubber keychain somewhere between the Labs and the Canteen. Had three keys total.',
    category:    'Keys',
    zone:        'Labs',
    incidentDate: daysAgo(2),
    status:      'open',
    isDeleted:   false,
  },
  {
    authorId:    oid('6604fff666aaa777bbb8880f'),
    type:        'found',
    title:       'Found a set of keys in Canteen',
    description: 'Found a set of keys with a red lanyard attached on one of the Canteen tables near the window. Handed to Canteen supervisor for safe keeping.',
    category:    'Keys',
    zone:        'Canteen',
    incidentDate: daysAgo(1),
    status:      'open',
    isDeleted:   false,
  },
  {
    authorId:    oid('6605aaa111bbb222ccc33310'),
    type:        'lost',
    title:       'Grey hoodie left in Lecture Hall',
    description: 'Forgot my grey Adidas hoodie in Lecture Hall C after the 2 PM session on Thursday. It has a small coffee stain near the right cuff.',
    category:    'Clothing',
    zone:        'Lecture Halls',
    incidentDate: daysAgo(4),
    status:      'open',
    isDeleted:   false,
  },
  {
    authorId:    oid('6605bbb222ccc333ddd44411'),
    type:        'found',
    title:       'Found MacBook charger in Library',
    description: 'Found a 67W USB-C MacBook Pro charger plugged into a socket on the ground floor of the Library. No laptop was nearby. Left at the Library reception desk.',
    category:    'Electronics',
    zone:        'Library',
    incidentDate: daysAgo(0),
    status:      'open',
    isDeleted:   false,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding…');

    // Clear existing data
    await Promise.all([
      Post.deleteMany({}),
      MatchScoreCache.deleteMany({}),
    ]);
    console.log('Cleared existing posts and matchscorecaches.');

    // Insert seed posts
    const inserted = await Post.insertMany(posts);
    console.log(`Seeded ${inserted.length} posts`);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
