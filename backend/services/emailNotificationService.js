'use strict';

const { emitter } = require('./matchService');

const initEmailListeners = () => {
  emitter.on('match:found', async (payload) => {
    // STUB: Log the event for now
    console.log('[EmailService] match:found event received:', {
      postTitle:    payload.sourcePost.title,
      authorId:     payload.sourcePost.authorId,
      matchCount:   payload.matchedPosts.length,
      topScore:     payload.topScore
    });

    // TODO Week 11 (Shiraj): Replace this stub with:
    // await sendMatchNotificationEmail({
    //   to:      authorEmail,   // fetch from Users collection by authorId
    //   subject: `Match found for your post: ${payload.sourcePost.title}`,
    //   body:    `A ${payload.topScore}% match was found for your lost item.`
    // });
  });

  console.log('[EmailService] Email notification listeners registered');
};

module.exports = { initEmailListeners };
