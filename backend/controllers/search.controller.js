'use strict';
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');

exports.search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return sendSuccess(res, 200, 'Résultats', []);
  return sendSuccess(res, 200, 'Résultats de recherche', { query: q, results: [] });
});
