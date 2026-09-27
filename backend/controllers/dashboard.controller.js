'use strict';
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');

exports.getStats = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Statistiques dashboard', {
    projects: { total: 0, actifs: 0, termines: 0, enRetard: 0 },
    employees: { total: 0 },
    finance: { budgetGlobal: 0, depenses: 0 },
  });
});

exports.getOverview = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Vue globale', {});
});

exports.getCharts = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Données graphiques', {});
});
