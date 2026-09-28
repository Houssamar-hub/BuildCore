'use strict';

const Project = require('../models/Project');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const Incident = require('../models/Incident');
const Material = require('../models/Material');
const Equipment = require('../models/Equipment');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/v1/dashboard/stats
 * Statistiques globales pour le dashboard
 */
exports.getStats = asyncHandler(async (req, res) => {
  const [
    totalProjects,
    activeProjects,
    lateProjects,
    completedProjects,
    totalEmployees,
    activeEmployees,
    openIncidents,
    criticalIncidents,
    lowStockMaterials,
    totalTasks,
    overdueTasks,
    inProgressTasks,
    totalEquipment,
    maintenanceEquipment,
    unreadNotifications,
  ] = await Promise.all([
    Project.countDocuments({ isArchived: false }),
    Project.countDocuments({ status: 'en_cours', isArchived: false }),
    Project.countDocuments({ status: 'en_retard', isArchived: false }),
    Project.countDocuments({ status: 'termine', isArchived: false }),
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'actif' }),
    Incident.countDocuments({ status: { $in: ['ouvert', 'en_cours'] } }),
    Incident.countDocuments({ status: 'ouvert', priority: 'critique' }),
    Material.countDocuments({ $expr: { $lte: ['$stockQuantity', '$minimumStock'] } }),
    Task.countDocuments(),
    Task.countDocuments({ status: { $ne: 'terminee' }, dueDate: { $lt: new Date() } }),
    Task.countDocuments({ status: 'en_cours' }),
    Equipment.countDocuments(),
    Equipment.countDocuments({ status: 'en_maintenance' }),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  return sendSuccess(res, 200, 'Statistiques dashboard', {
    projects: {
      total: totalProjects,
      actifs: activeProjects,
      enRetard: lateProjects,
      termines: completedProjects,
    },
    employees: {
      total: totalEmployees,
      actifs: activeEmployees,
    },
    tasks: {
      total: totalTasks,
      enCours: inProgressTasks,
      enRetard: overdueTasks,
    },
    incidents: {
      ouverts: openIncidents,
      critiques: criticalIncidents,
    },
    stock: {
      alertes: lowStockMaterials,
    },
    equipment: {
      total: totalEquipment,
      enMaintenance: maintenanceEquipment,
    },
    notifications: {
      nonLues: unreadNotifications,
    },
  });
});

/**
 * GET /api/v1/dashboard/overview
 * Vue globale: projets récents, tâches urgentes, incidents actifs
 */
exports.getOverview = asyncHandler(async (req, res) => {
  const [recentProjects, urgentTasks, activeIncidents] = await Promise.all([
    Project.find({ isArchived: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('reference name type status progress budget dates location')
      .populate('manager', 'firstName lastName')
      .lean(),

    Task.find({ status: { $ne: 'terminee' }, dueDate: { $lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } })
      .sort({ dueDate: 1 })
      .limit(8)
      .select('title status priority dueDate project assignedTo')
      .populate('project', 'name')
      .populate('assignedTo', 'firstName lastName')
      .lean(),

    Incident.find({ status: { $in: ['ouvert', 'en_cours'] } })
      .sort({ priority: -1, createdAt: -1 })
      .limit(5)
      .select('reference title type priority status date project')
      .populate('project', 'name')
      .lean(),
  ]);

  return sendSuccess(res, 200, 'Vue globale dashboard', {
    recentProjects,
    urgentTasks,
    activeIncidents,
  });
});

/**
 * GET /api/v1/dashboard/charts
 * Données pour les graphiques du dashboard
 */
exports.getCharts = asyncHandler(async (req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));

  // Dépenses par mois (6 derniers mois)
  const monthlyExpenses = await Expense.aggregate([
    { $match: { date: { $gte: sixMonthsAgo }, status: { $in: ['approuvee', 'payee'] } } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 6 },
  ]);

  // Répartition projets par statut
  const projectsByStatus = await Project.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Répartition projets par type
  const projectsByType = await Project.aggregate([
    { $match: { isArchived: false } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);

  return sendSuccess(res, 200, 'Données graphiques', {
    monthlyExpenses,
    projectsByStatus,
    projectsByType,
  });
});
