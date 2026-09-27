'use strict';

/**
 * Wrapper pour éviter les try/catch dans les controllers async
 * @param {Function} fn - Fonction async du controller
 * @returns {Function} Middleware Express
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
