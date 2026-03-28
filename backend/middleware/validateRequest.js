'use strict';

const { validationResult } = require('express-validator');

/**
 * validateRequest.js
 * Reusable express-validator result checker.
 * Place this as the LAST middleware in any validator chain, before the controller.
 *
 * On validation errors → 400 { errors: [{ field, message }] }
 * On no errors         → calls next()
 *
 * Usage:
 *   router.post('/posts', [...validators], validateRequest, postController.create);
 */

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field:   err.path,
      message: err.msg,
    }));
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateRequest;
