'use strict';
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    AuditLog.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    AuditLog.countDocuments(),
  ]);
  return sendPaginated(res, items, total, page, limit);
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const item = await AuditLog.findById(req.params.id);
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Récupéré.', item);
});
