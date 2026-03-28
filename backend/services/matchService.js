'use strict';

const EventEmitter    = require('events');
const Post            = require('../models/Post');
const MatchScoreCache = require('../models/MatchScoreCache');

// ─── Event emitter (email service subscribes to 'match:found') ───────────────
const emitter = new EventEmitter();

// ─── Adjacency map (sourced from Post.statics) ───────────────────────────────
const ADJACENT_ZONES = Post.ADJACENT_ZONES;

// ─── Private Scoring Helpers ──────────────────────────────────────────────────

/**
 * @param {string} catA
 * @param {string} catB
 * @returns {number} 40 | 0
 */
const getCategoryScore = (catA, catB) => {
  return catA === catB ? 40 : 0;
};

/**
 * @param {string} zoneA
 * @param {string} zoneB
 * @returns {number} 35 | 18 | 0
 */
const getZoneScore = (zoneA, zoneB) => {
  if (zoneA === zoneB) return 35;
  if (ADJACENT_ZONES[zoneA]?.includes(zoneB)) return 18;
  return 0;
};

/**
 * Returns score based on how close the two incident dates are.
 * @param {Date|string} dateA
 * @param {Date|string} dateB
 * @returns {number} 25 | 15 | 8 | 0
 */
const getDateScore = (dateA, dateB) => {
  const diffMs   = Math.abs(new Date(dateA) - new Date(dateB));
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return 25;
  if (diffDays <= 3)  return 15;
  if (diffDays <= 7)  return 8;
  return 0;
};

// ─── Public: runMatchFor ──────────────────────────────────────────────────────

/**
 * Scores all opposite-type open/matched posts against sourcePost,
 * stores results in MatchScoreCache, and emits 'match:found' if any pass
 * the threshold (score >= 60).
 *
 * @param {import('mongoose').Document} sourcePost
 * @returns {Promise<Array>} Array of match result objects.
 */
const runMatchFor = async (sourcePost) => {
  const oppositeType = sourcePost.type === 'lost' ? 'found' : 'lost';

  // Fetch all eligible candidates (hits 'match_engine_compound' index)
  const candidates = await Post.find(
    {
      type:      oppositeType,
      status:    { $in: ['open', 'matched'] },
      isDeleted: false,
      _id:       { $ne: sourcePost._id },
    },
    'title category zone incidentDate imageUrls authorId status'
  ).lean();

  const now = new Date();

  // Score each candidate
  const scored = candidates
    .map((candidate) => {
      const categoryScore = getCategoryScore(sourcePost.category, candidate.category);
      const zoneScore     = getZoneScore(sourcePost.zone, candidate.zone);
      const dateScore     = getDateScore(sourcePost.incidentDate, candidate.incidentDate);
      const score         = categoryScore + zoneScore + dateScore;

      return {
        matchedPostId: candidate._id,
        score,
        breakdown: { categoryScore, zoneScore, dateScore },
        matchedPostSnapshot: {
          title:        candidate.title,
          category:     candidate.category,
          zone:         candidate.zone,
          incidentDate: candidate.incidentDate,
          imageUrls:    candidate.imageUrls,
          authorId:     candidate.authorId,
          status:       candidate.status,
        },
      };
    })
    // Apply threshold
    .filter((r) => r.score >= 60)
    // Sort best first
    .sort((a, b) => b.score - a.score);

  // Upsert into MatchScoreCache
  await MatchScoreCache.findOneAndUpdate(
    { sourcePostId: sourcePost._id },
    {
      sourcePostId: sourcePost._id,
      matches:      scored,
      cachedAt:     now,
      expiresAt:    new Date(now.getTime() + 30 * 60 * 1000),
    },
    { upsert: true, new: true }
  );

  // Update source post counters and status
  await Post.findByIdAndUpdate(sourcePost._id, {
    matchCount:    scored.length,
    lastMatchedAt: now,
    status:        scored.length > 0 ? 'matched' : 'open',
  });

  // Emit event for email service
  if (scored.length > 0) {
    emitter.emit('match:found', {
      sourcePost: {
        _id:      sourcePost._id,
        title:    sourcePost.title,
        authorId: sourcePost.authorId,
      },
      matchedPosts: scored.map((r) => r.matchedPostId),
      topScore:     scored[0].score,
    });
  }

  return scored;
};

// ─── Public: getMatchesForPost ────────────────────────────────────────────────

/**
 * Returns cached matches if available. Otherwise runs the engine and caches
 * the result. Returns [] if the post does not exist.
 *
 * @param {import('mongoose').Types.ObjectId|string} postId
 * @returns {Promise<Array>}
 */
const getMatchesForPost = async (postId) => {
  // Serve from cache first (MongoDB TTL guarantees freshness within 30 min)
  const cached = await MatchScoreCache.findOne({ sourcePostId: postId }).lean();
  if (cached) return cached.matches;

  // Cache miss — fetch post and run engine
  const post = await Post.findById(postId).lean();
  if (!post) return [];

  return runMatchFor(post);
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = { emitter, runMatchFor, getMatchesForPost };
