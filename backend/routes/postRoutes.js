'use strict';

const { Router } = require('express');

const auth     = require('../middleware/auth');
const validate = require('../middleware/validateRequest');
const v        = require('../validators/postValidators');
const ctrl          = require('../controllers/postController');
const matchCtrl     = require('../controllers/matchController');

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/posts          — browse with filters, pagination, full-text search
router.get('/', v.queryFilters, validate, ctrl.getPosts);

// GET /api/posts/:id      — single post detail
router.get('/:id', ctrl.getPostById);

// ── Authenticated ─────────────────────────────────────────────────────────────

// GET /api/posts/mine     — posts belonging to the current user
// NOTE: must be defined BEFORE /:id so Express doesn't treat "mine" as an id
router.get('/mine', auth, ctrl.getMyPosts);

// POST /api/posts         — create a new post
router.post('/', auth, v.createPost, validate, ctrl.createPost);

// PUT /api/posts/:id      — edit a post (owner only)
router.put('/:id', auth, v.updatePost, validate, ctrl.updatePost);

// DELETE /api/posts/:id   — soft-delete a post (owner only)
router.delete('/:id', auth, ctrl.deletePost);

// PATCH /api/posts/:id/status — status transition (admin only)
router.patch('/:id/status', auth, v.updateStatus, validate, ctrl.updateStatus);

// GET /api/posts/:id/matches  — owner or admin: serve cache or run engine
router.get('/:id/matches', auth, matchCtrl.getMatchesForPost);

module.exports = router;
