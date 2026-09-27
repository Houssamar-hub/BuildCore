'use strict';

const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const { sendError } = require('../utils/apiResponse');

/**
 * Gestion des erreurs Mongoose - CastError (ID invalide)
 */
const handleCastErrorDB = (err) => {
  const message = `Valeur invalide pour le champ ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Gestion des erreurs Mongoose - Duplicate Key
 */
const handleDuplicateFieldsDB = (err) => {
  const fields = Object.keys(err.keyValue).join(', ');
  const message = `Valeur dupliquée pour: ${fields}. Veuillez utiliser une autre valeur.`;
  return new AppError(message, 409);
};

/**
 * Gestion des erreurs Mongoose - Validation
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Données invalides: ${errors.join('. ')}`;
  return new AppError(message, 422);
};

/**
 * Gestion des erreurs JWT - Token invalide
 */
const handleJWTError = () =>
  new AppError('Token invalide. Veuillez vous reconnecter.', 401);

/**
 * Gestion des erreurs JWT - Token expiré
 */
const handleJWTExpiredError = () =>
  new AppError('Votre session a expiré. Veuillez vous reconnecter.', 401);

/**
 * Gestion des erreurs Multer - Fichier trop grand
 */
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('Fichier trop volumineux. Limite: 10MB.', 413);
  }
  return new AppError('Erreur lors du téléchargement du fichier.', 400);
};

/**
 * Réponse erreur en développement
 */
const sendErrorDev = (err, res) => {
  sendError(res, err.statusCode, err.message, {
    status: err.status,
    code: err.code,
    stack: err.stack,
  });
};

/**
 * Réponse erreur en production
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    sendError(res, err.statusCode, err.message);
  } else {
    logger.error('ERREUR NON OPÉRATIONNELLE:', err);
    sendError(res, 500, 'Une erreur interne est survenue.');
  }
};

/**
 * Middleware global de gestion des erreurs
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'MulterError') error = handleMulterError(error);

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
