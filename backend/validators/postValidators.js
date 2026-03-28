'use strict';

const { body, query } = require('express-validator');
const Post = require('../models/Post');

const { CATEGORIES, ZONES } = Post;

// ─── Reusable date-not-in-future check ───────────────────────────────────────

const notInFuture = (value) => {
  if (new Date(value) > new Date()) {
    throw new Error('incidentDate must not be in the future');
  }
  return true;
};

// ─── createPost ──────────────────────────────────────────────────────────────

const createPost = [
  body('type')
    .isIn(['lost', 'found'])
    .withMessage('type must be "lost" or "found"'),

  body('title')
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage('title must be between 5 and 120 characters'),

  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('description must be between 20 and 1000 characters'),

  body('category')
    .isIn(CATEGORIES)
    .withMessage(`category must be one of: ${CATEGORIES.join(', ')}`),

  body('zone')
    .isIn(ZONES)
    .withMessage(`zone must be one of: ${ZONES.join(', ')}`),

  body('incidentDate')
    .isISO8601()
    .withMessage('incidentDate must be a valid ISO 8601 date')
    .custom(notInFuture),

  body('imageUrls')
    .optional()
    .isArray({ max: 3 })
    .withMessage('imageUrls must be an array with at most 3 items'),

  body('imageUrls.*')
    .optional()
    .isURL()
    .withMessage('each imageUrl must be a valid URL'),
];

// ─── updatePost (all optional) ────────────────────────────────────────────────

const updatePost = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage('title must be between 5 and 120 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('description must be between 20 and 1000 characters'),

  body('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`category must be one of: ${CATEGORIES.join(', ')}`),

  body('zone')
    .optional()
    .isIn(ZONES)
    .withMessage(`zone must be one of: ${ZONES.join(', ')}`),

  body('incidentDate')
    .optional()
    .isISO8601()
    .withMessage('incidentDate must be a valid ISO 8601 date')
    .custom(notInFuture),

  body('imageUrls')
    .optional()
    .isArray({ max: 3 })
    .withMessage('imageUrls must be an array with at most 3 items'),

  body('imageUrls.*')
    .optional()
    .isURL()
    .withMessage('each imageUrl must be a valid URL'),
];

// ─── updateStatus ─────────────────────────────────────────────────────────────

const updateStatus = [
  body('status')
    .isIn(['open', 'matched', 'resolved'])
    .withMessage('status must be one of: open, matched, resolved'),
];

// ─── queryFilters ─────────────────────────────────────────────────────────────

const queryFilters = [
  query('type')
    .optional()
    .isIn(['lost', 'found'])
    .withMessage('type must be "lost" or "found"'),

  query('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`category must be one of: ${CATEGORIES.join(', ')}`),

  query('zone')
    .optional()
    .isIn(ZONES)
    .withMessage(`zone must be one of: ${ZONES.join(', ')}`),

  query('status')
    .optional()
    .isIn(['open', 'matched', 'resolved'])
    .withMessage('status must be one of: open, matched, resolved'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50')
    .toInt(),

  query('from')
    .optional()
    .isISO8601()
    .withMessage('from must be a valid ISO 8601 date'),

  query('to')
    .optional()
    .isISO8601()
    .withMessage('to must be a valid ISO 8601 date'),

  query('q')
    .optional()
    .isString()
    .trim()
    .withMessage('q must be a string'),
];

module.exports = { createPost, updatePost, updateStatus, queryFilters };
