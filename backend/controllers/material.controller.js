'use strict';
const Material = require('../models/Material');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Material.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Material.countDocuments(),
  ]);
  return sendPaginated(res, items, total, page, limit);
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Material.create({ ...req.body, createdBy: req.user._id });
  return sendSuccess(res, 201, 'Créé avec succès.', item);
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const item = await Material.findById(req.params.id);
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Récupéré.', item);
});

exports.update = asyncHandler(async (req, res, next) => {
  const item = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Mis à jour.', item);
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await Material.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Supprimé.');
});

exports.getLowStock = asyncHandler(async (req, res) => {
  const items = await Material.find({ $expr: { $lte: ['$stockQuantity', '$minimumStock'] } });
  return sendSuccess(res, 200, 'Stocks faibles', items);
});
