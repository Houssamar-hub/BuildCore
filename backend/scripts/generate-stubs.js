/**
 * Script pour créer tous les fichiers routes et controllers manquants
 */
const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'user', model: 'User', modelFile: '../models/User' },
  { name: 'project', model: 'Project', modelFile: '../models/Project', extras: ['getStats'] },
  { name: 'projectPhase', model: 'ProjectPhase', modelFile: '../models/ProjectPhase' },
  { name: 'task', model: 'Task', modelFile: '../models/Task', extras: ['getMyTasks'] },
  { name: 'employee', model: 'Employee', modelFile: '../models/Employee' },
  { name: 'team', model: 'Team', modelFile: '../models/Team' },
  { name: 'attendance', model: 'Attendance', modelFile: '../models/Attendance', extras: ['getStats'] },
  { name: 'report', model: 'DailyReport', modelFile: '../models/DailyReport' },
  { name: 'material', model: 'Material', modelFile: '../models/Material', extras: ['getLowStock'] },
  { name: 'stock', model: 'StockMovement', modelFile: '../models/StockMovement' },
  { name: 'supplier', model: 'Supplier', modelFile: '../models/Supplier' },
  { name: 'client', model: 'Client', modelFile: '../models/Client' },
  { name: 'subcontractor', model: 'Subcontractor', modelFile: '../models/Subcontractor', destructure: true },
  { name: 'purchase', model: 'PurchaseRequest', modelFile: '../models/Purchase', destructure: true, extras: ['approve', 'reject'] },
  { name: 'invoice', model: 'Invoice', modelFile: '../models/Invoice', destructure: true },
  { name: 'payment', model: 'Payment', modelFile: '../models/Invoice', destructure: true },
  { name: 'expense', model: 'Expense', modelFile: '../models/Expense' },
  { name: 'budget', model: 'Budget', modelFile: '../models/Budget' },
  { name: 'equipment', model: 'Equipment', modelFile: '../models/Equipment' },
  { name: 'maintenance', model: 'Maintenance', modelFile: '../models/Maintenance' },
  { name: 'fuel', model: 'FuelTransaction', modelFile: '../models/FuelTransaction' },
  { name: 'incident', model: 'Incident', modelFile: '../models/Incident' },
  { name: 'quality', model: 'QualityControl', modelFile: '../models/QualityControl' },
  { name: 'document', model: 'Document', modelFile: '../models/Document' },
  { name: 'photo', model: 'Photo', modelFile: '../models/Photo' },
  { name: 'notification', model: 'Notification', modelFile: '../models/Notification', extras: ['markAllRead', 'getUnreadCount'] },
  { name: 'audit', model: 'AuditLog', modelFile: '../models/AuditLog', readOnly: true },
  { name: 'dashboard', model: null, modelFile: null, special: 'dashboard' },
  { name: 'search', model: null, modelFile: null, special: 'search' },
];

// ─── Créer les routes manquantes ──────────────────────────────
const routesDir = path.join(__dirname, '../routes');
const controllersDir = path.join(__dirname, '../controllers');

for (const mod of modules) {
  const routeFile = path.join(routesDir, `${mod.name}.routes.js`);
  const controllerFile = path.join(controllersDir, `${mod.name}.controller.js`);

  // ─── ROUTE FILE ─────────────────────────────────────────────
  if (!fs.existsSync(routeFile)) {
    let routeContent = `'use strict';\nconst express = require('express');\nconst router = express.Router();\nconst controller = require('../controllers/${mod.name}.controller');\nconst { protect, restrictTo } = require('../middleware/auth');\n\nrouter.use(protect);\n\n`;

    if (mod.special === 'dashboard') {
      routeContent += `router.get('/stats', controller.getStats);\nrouter.get('/overview', controller.getOverview);\nrouter.get('/charts', controller.getCharts);\n`;
    } else if (mod.special === 'search') {
      routeContent += `router.get('/', controller.search);\n`;
    } else if (mod.readOnly) {
      routeContent += `router.get('/', restrictTo('admin', 'directeur'), controller.getAll);\nrouter.get('/:id', restrictTo('admin', 'directeur'), controller.getOne);\n`;
    } else {
      routeContent += `router.route('/')\n  .get(controller.getAll)\n  .post(controller.create);\n\nrouter.route('/:id')\n  .get(controller.getOne)\n  .patch(controller.update)\n  .delete(controller.remove);\n`;

      if (mod.extras) {
        for (const extra of mod.extras) {
          if (extra === 'getStats') routeContent += `\nrouter.get('/stats/summary', controller.getStats);\n`;
          else if (extra === 'getLowStock') routeContent += `\nrouter.get('/alerts/low-stock', controller.getLowStock);\n`;
          else if (extra === 'getMyTasks') routeContent += `\nrouter.get('/my/assigned', controller.getMyTasks);\n`;
          else if (extra === 'markAllRead') routeContent += `\nrouter.patch('/mark-all-read', controller.markAllRead);\nrouter.get('/unread-count', controller.getUnreadCount);\n`;
          else if (extra === 'approve') routeContent += `\nrouter.patch('/:id/approve', controller.approve);\nrouter.patch('/:id/reject', controller.reject);\n`;
        }
      }
    }

    routeContent += `\nmodule.exports = router;\n`;
    fs.writeFileSync(routeFile, routeContent);
    console.log(`✅ Route créée: ${mod.name}.routes.js`);
  } else {
    console.log(`⏭️  Route existe: ${mod.name}.routes.js`);
  }

  // ─── CONTROLLER FILE ────────────────────────────────────────
  if (!fs.existsSync(controllerFile)) {
    let importLine = '';
    if (mod.modelFile) {
      if (mod.destructure) {
        importLine = `const { ${mod.model} } = require('${mod.modelFile}');\n`;
      } else {
        importLine = `const ${mod.model} = require('${mod.modelFile}');\n`;
      }
    }

    let controllerContent = `'use strict';\n${importLine}const asyncHandler = require('../utils/asyncHandler');\nconst AppError = require('../utils/appError');\nconst { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');\n\n`;

    if (mod.special === 'dashboard') {
      controllerContent += `exports.getStats = asyncHandler(async (req, res) => {\n  return sendSuccess(res, 200, 'Statistiques dashboard', {\n    projects: { total: 0, actifs: 0, termines: 0, enRetard: 0 },\n    employees: { total: 0 },\n    finance: { budgetGlobal: 0, depenses: 0 },\n  });\n});\n\nexports.getOverview = asyncHandler(async (req, res) => {\n  return sendSuccess(res, 200, 'Vue globale', {});\n});\n\nexports.getCharts = asyncHandler(async (req, res) => {\n  return sendSuccess(res, 200, 'Données graphiques', {});\n});\n`;
    } else if (mod.special === 'search') {
      controllerContent += `exports.search = asyncHandler(async (req, res) => {\n  const { q } = req.query;\n  if (!q) return sendSuccess(res, 200, 'Résultats', []);\n  return sendSuccess(res, 200, 'Résultats de recherche', { query: q, results: [] });\n});\n`;
    } else if (mod.readOnly) {
      controllerContent += `exports.getAll = asyncHandler(async (req, res) => {\n  const page = parseInt(req.query.page) || 1;\n  const limit = parseInt(req.query.limit) || 20;\n  const skip = (page - 1) * limit;\n  const [items, total] = await Promise.all([\n    ${mod.model}.find().skip(skip).limit(limit).sort({ createdAt: -1 }),\n    ${mod.model}.countDocuments(),\n  ]);\n  return sendPaginated(res, items, total, page, limit);\n});\n\nexports.getOne = asyncHandler(async (req, res, next) => {\n  const item = await ${mod.model}.findById(req.params.id);\n  if (!item) return next(new AppError('Non trouvé.', 404));\n  return sendSuccess(res, 200, 'Récupéré.', item);\n});\n`;
    } else {
      controllerContent += `exports.getAll = asyncHandler(async (req, res) => {\n  const page = parseInt(req.query.page) || 1;\n  const limit = parseInt(req.query.limit) || 20;\n  const skip = (page - 1) * limit;\n  const [items, total] = await Promise.all([\n    ${mod.model}.find().skip(skip).limit(limit).sort({ createdAt: -1 }),\n    ${mod.model}.countDocuments(),\n  ]);\n  return sendPaginated(res, items, total, page, limit);\n});\n\nexports.create = asyncHandler(async (req, res) => {\n  const item = await ${mod.model}.create({ ...req.body, createdBy: req.user._id });\n  return sendSuccess(res, 201, 'Créé avec succès.', item);\n});\n\nexports.getOne = asyncHandler(async (req, res, next) => {\n  const item = await ${mod.model}.findById(req.params.id);\n  if (!item) return next(new AppError('Non trouvé.', 404));\n  return sendSuccess(res, 200, 'Récupéré.', item);\n});\n\nexports.update = asyncHandler(async (req, res, next) => {\n  const item = await ${mod.model}.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });\n  if (!item) return next(new AppError('Non trouvé.', 404));\n  return sendSuccess(res, 200, 'Mis à jour.', item);\n});\n\nexports.remove = asyncHandler(async (req, res, next) => {\n  const item = await ${mod.model}.findByIdAndDelete(req.params.id);\n  if (!item) return next(new AppError('Non trouvé.', 404));\n  return sendSuccess(res, 200, 'Supprimé.');\n});\n`;

      if (mod.extras) {
        for (const extra of mod.extras) {
          if (extra === 'getStats') {
            controllerContent += `\nexports.getStats = asyncHandler(async (req, res) => {\n  const total = await ${mod.model}.countDocuments();\n  return sendSuccess(res, 200, 'Statistiques', { total });\n});\n`;
          } else if (extra === 'getLowStock') {
            controllerContent += `\nexports.getLowStock = asyncHandler(async (req, res) => {\n  const items = await ${mod.model}.find({ $expr: { $lte: ['$stockQuantity', '$minimumStock'] } });\n  return sendSuccess(res, 200, 'Stocks faibles', items);\n});\n`;
          } else if (extra === 'getMyTasks') {
            controllerContent += `\nexports.getMyTasks = asyncHandler(async (req, res) => {\n  const items = await ${mod.model}.find({ assignedTo: req.user._id }).sort({ dueDate: 1 });\n  return sendSuccess(res, 200, 'Mes tâches', items);\n});\n`;
          } else if (extra === 'markAllRead') {
            controllerContent += `\nexports.markAllRead = asyncHandler(async (req, res) => {\n  await ${mod.model}.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: new Date() });\n  return sendSuccess(res, 200, 'Tout marqué comme lu.');\n});\n\nexports.getUnreadCount = asyncHandler(async (req, res) => {\n  const count = await ${mod.model}.countDocuments({ recipient: req.user._id, isRead: false });\n  return sendSuccess(res, 200, 'Compteur notifications', { count });\n});\n`;
          } else if (extra === 'approve') {
            controllerContent += `\nexports.approve = asyncHandler(async (req, res, next) => {\n  const item = await ${mod.model}.findByIdAndUpdate(req.params.id, { status: 'approuvee', approvedBy: req.user._id, approvedAt: new Date() }, { new: true });\n  if (!item) return next(new AppError('Non trouvé.', 404));\n  return sendSuccess(res, 200, 'Approuvé.', item);\n});\n\nexports.reject = asyncHandler(async (req, res, next) => {\n  const item = await ${mod.model}.findByIdAndUpdate(req.params.id, { status: 'rejetee', rejectionReason: req.body.reason }, { new: true });\n  if (!item) return next(new AppError('Non trouvé.', 404));\n  return sendSuccess(res, 200, 'Rejeté.', item);\n});\n`;
          }
        }
      }
    }

    fs.writeFileSync(controllerFile, controllerContent);
    console.log(`✅ Controller créé: ${mod.name}.controller.js`);
  } else {
    console.log(`⏭️  Controller existe: ${mod.name}.controller.js`);
  }
}

console.log('\n✅ Tous les fichiers routes et controllers ont été créés!');
