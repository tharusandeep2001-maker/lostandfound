'use strict';

/**
 * auth.js
 * Environment-switched authentication middleware.
 *
 * USE_MOCK_AUTH=true  → mockAuth  (injects a fake user, no token required)
 * USE_MOCK_AUTH=false → verifyToken (validates JWT Bearer tokens)
 *
 * Import this everywhere you need route protection:
 *   const auth = require('../middleware/auth');
 *   router.get('/protected', auth, controller);
 */

const mockAuth    = require('./mockAuth');
const verifyToken = require('./verifyToken');

const useMock = process.env.USE_MOCK_AUTH === 'true';

if (useMock) {
  console.log('Auth mode: MOCK');
} else {
  console.log('Auth mode: JWT');
}

module.exports = useMock ? mockAuth : verifyToken;
