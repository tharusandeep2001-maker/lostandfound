'use strict';

/**
 * mockAuth.js
 * Development-only middleware that injects a fake req.user without any
 * token validation. Switch mock roles by sending the header:
 *   x-mock-role: admin   → injects the admin user
 *   x-mock-role: student → injects the student user (default)
 */

const MOCK_USERS = {
  student: {
    _id:   '6601abc123def456789abcde',
    name:  'Ranasinghe AGTS',
    email: 'agts@university.lk',
    role:  'student',
  },
  admin: {
    _id:   '6601fff999aaa111bbb222cc',
    name:  'Test Admin',
    email: 'admin@university.lk',
    role:  'admin',
  },
};

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const mockAuth = (req, res, next) => {
  const roleHeader = (req.headers['x-mock-role'] || 'student').toLowerCase();
  req.user = MOCK_USERS[roleHeader] ?? MOCK_USERS.student;
  next();
};

module.exports = mockAuth;
