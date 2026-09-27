'use strict';
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Project.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Project.countDocuments(),
  ]);
  return sendPaginated(res, items, total, page, limit);
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Project.create({ ...req.body, createdBy: req.user._id });
  return sendSuccess(res, 201, 'Créé avec succès.', item);
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const item = await Project.findById(req.params.id);
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Récupéré.', item);
});

exports.update = asyncHandler(async (req, res, next) => {
  const item = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Mis à jour.', item);
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Supprimé.');
});

exports.getStats = asyncHandler(async (req, res) => {
  const total = await Project.countDocuments();
  return sendSuccess(res, 200, 'Statistiques', { total });
});
