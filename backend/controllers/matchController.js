'use strict';

const Post         = require('../models/Post');
const matchService = require('../services/matchService');

/**
 * GET /api/posts/:id/matches
 * Returns match suggestions for a post (owner or admin only).
 * Serves from cache if available; runs engine on cache miss.
 */
const getMatchesForPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, isDeleted: false }).lean();

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const isOwner = post.authorId.toString() === req.user._id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      message: 'Only the post owner can view match suggestions',
    });
  }

  const matches = await matchService.getMatchesForPost(post._id);

  return res.status(200).json({
    postId:  post._id,
    count:   matches.length,
    matches,
  });
};

module.exports = { getMatchesForPost };
