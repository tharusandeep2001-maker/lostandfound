/**
 * constants.js
 * Single source of truth for all enum values used across the frontend.
 * These mirror the Mongoose schema enums — never hardcode these strings in components.
 */

export const POST_TYPES = ['lost', 'found'];

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Keys',
  'ID Card',
  'Other',
];

export const ZONES = ['Library', 'Canteen', 'Lecture Halls', 'Labs'];

export const POST_STATUSES = ['open', 'matched', 'resolved'];

export const STATUS_LABELS = {
  open:     'Open',
  matched:  'Matched',
  resolved: 'Resolved',
};

export const STATUS_COLORS = {
  open:     'bg-green-100 text-green-800',
  matched:  'bg-amber-100 text-amber-800',
  resolved: 'bg-gray-100 text-gray-600',
};

export const TYPE_COLORS = {
  lost:  'bg-red-100 text-red-800',
  found: 'bg-blue-100 text-blue-800',
};
