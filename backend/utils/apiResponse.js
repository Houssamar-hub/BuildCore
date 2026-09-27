'use strict';

/**
 * Construire une réponse API standardisée
 */

/**
 * Réponse succès
 * @param {object} res - Express response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Message
 * @param {*} data - Data payload
 * @param {object} meta - Metadata (pagination, etc.)
 */
const sendSuccess = (res, statusCode = 200, message = 'Succès', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Réponse erreur
 * @param {object} res - Express response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Message d'erreur
 * @param {*} errors - Détail des erreurs
 */
const sendError = (res, statusCode = 500, message = 'Erreur serveur', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Réponse avec pagination
 * @param {object} res - Express response
 * @param {Array} data - Données
 * @param {number} total - Total documents
 * @param {number} page - Page courante
 * @param {number} limit - Limite par page
 * @param {string} message - Message
 */
const sendPaginated = (res, data, total, page, limit, message = 'Succès') => {
  const totalPages = Math.ceil(total / limit);
  return sendSuccess(res, 200, message, data, {
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
