'use strict';

const Project = require('../models/Project');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const Supplier = require('../models/Supplier');
const Equipment = require('../models/Equipment');
const Material = require('../models/Material');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/v1/search?q=...&types=projects,employees
 * Recherche globale multi-modèles
 */
exports.search = asyncHandler(async (req, res) => {
  const { q, types } = req.query;

  if (!q || q.trim().length < 2) {
    return sendSuccess(res, 200, 'Recherche', { results: [], total: 0, query: q });
  }

  const searchRegex = new RegExp(q.trim(), 'i');
  const requestedTypes = types ? types.split(',') : ['projects', 'employees', 'clients', 'suppliers', 'equipment', 'materials'];

  const searches = [];

  if (requestedTypes.includes('projects')) {
    searches.push(
      Project.find({
        isArchived: false,
        $or: [
          { name: searchRegex },
          { reference: searchRegex },
          { description: searchRegex },
          { 'location.city': searchRegex },
        ],
      })
        .select('reference name type status progress location.city')
        .limit(5)
        .lean()
        .then((r) => ({ type: 'project', label: 'Projets', results: r }))
    );
  }

  if (requestedTypes.includes('employees')) {
    searches.push(
      Employee.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { employeeId: searchRegex },
          { cin: searchRegex },
        ],
      })
        .select('employeeId firstName lastName profession status')
        .limit(5)
        .lean()
        .then((r) => ({ type: 'employee', label: 'Employés', results: r }))
    );
  }

  if (requestedTypes.includes('clients')) {
    searches.push(
      Client.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { companyName: searchRegex },
          { ice: searchRegex },
        ],
      })
        .select('firstName lastName companyName clientType city')
        .limit(5)
        .lean()
        .then((r) => ({ type: 'client', label: 'Clients', results: r }))
    );
  }

  if (requestedTypes.includes('suppliers')) {
    searches.push(
      Supplier.find({
        $or: [{ companyName: searchRegex }, { ice: searchRegex }, { city: searchRegex }],
      })
        .select('companyName categories city rating')
        .limit(5)
        .lean()
        .then((r) => ({ type: 'supplier', label: 'Fournisseurs', results: r }))
    );
  }

  if (requestedTypes.includes('equipment')) {
    searches.push(
      Equipment.find({
        $or: [
          { name: searchRegex },
          { reference: searchRegex },
          { registrationNumber: searchRegex },
          { brand: searchRegex },
        ],
      })
        .select('reference name type status brand model')
        .limit(5)
        .lean()
        .then((r) => ({ type: 'equipment', label: 'Équipements', results: r }))
    );
  }

  if (requestedTypes.includes('materials')) {
    searches.push(
      Material.find({
        $or: [{ name: searchRegex }, { reference: searchRegex }],
      })
        .select('reference name category unit stockQuantity minimumStock')
        .limit(5)
        .lean()
        .then((r) => ({ type: 'material', label: 'Matériaux', results: r }))
    );
  }

  const groups = await Promise.all(searches);
  const total = groups.reduce((acc, g) => acc + g.results.length, 0);

  return sendSuccess(res, 200, 'Résultats de recherche', {
    query: q,
    total,
    groups: groups.filter((g) => g.results.length > 0),
  });
});
