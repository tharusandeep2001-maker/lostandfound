'use strict';

const EVENTS = {
  MATCH_FOUND: {
    name: 'match:found',
    emittedBy: 'matchService.runMatchFor()',
    subscribedBy: 'emailNotificationService',
    payload: {
      sourcePost:   '{ _id: ObjectId, title: String, authorId: ObjectId }',
      matchedPosts: 'ObjectId[]',
      topScore:     'Number (0–100)'
    },
    description: 'Emitted after match engine finds at least one match with score >= 60'
  }
};

module.exports = Object.freeze(EVENTS);
