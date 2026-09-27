'use strict';
const { PurchaseRequest } = require('../models/Purchase');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    PurchaseRequest.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    PurchaseRequest.countDocuments(),
  ]);
  return sendPaginated(res, items, total, page, limit);
});

exports.create = asyncHandler(async (req, res) => {
  const item = await PurchaseRequest.create({ ...req.body, createdBy: req.user._id });
  return sendSuccess(res, 201, 'Créé avec succès.', item);
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const item = await PurchaseRequest.findById(req.params.id);
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Récupéré.', item);
});

exports.update = asyncHandler(async (req, res, next) => {
  const item = await PurchaseRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Mis à jour.', item);
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await PurchaseRequest.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Supprimé.');
});

exports.approve = asyncHandler(async (req, res, next) => {
  const item = await PurchaseRequest.findByIdAndUpdate(req.params.id, { status: 'approuvee', approvedBy: req.user._id, approvedAt: new Date() }, { new: true });
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Approuvé.', item);
});

exports.reject = asyncHandler(async (req, res, next) => {
  const item = await PurchaseRequest.findByIdAndUpdate(req.params.id, { status: 'rejetee', rejectionReason: req.body.reason }, { new: true });
  if (!item) return next(new AppError('Non trouvé.', 404));
  return sendSuccess(res, 200, 'Rejeté.', item);
});
