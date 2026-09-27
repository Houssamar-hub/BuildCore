'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const AuditLog = require('../models/AuditLog');

/**
 * Vérifier le token JWT et charger l'utilisateur
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Récupérer le token depuis l'en-tête Authorization ou les cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Accès non autorisé. Veuillez vous connecter.', 401));
  }

  // Vérifier le token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Votre session a expiré. Veuillez vous reconnecter.', 401));
    }
    return next(new AppError('Token invalide. Veuillez vous reconnecter.', 401));
  }

  // Vérifier que l'utilisateur existe toujours
  const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!currentUser) {
    return next(new AppError('Cet utilisateur n\'existe plus.', 401));
  }

  // Vérifier que le compte est actif
  if (!currentUser.isActive) {
    return next(new AppError('Votre compte a été désactivé. Contactez l\'administrateur.', 401));
  }

  // Vérifier si le mot de passe a été changé après l'émission du token
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Mot de passe modifié récemment. Veuillez vous reconnecter.', 401));
  }

  // Injecter l'utilisateur dans la requête
  req.user = currentUser;
  next();
});

/**
 * Restreindre l'accès à des rôles spécifiques
 * @param {...string} roles - Rôles autorisés
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Accès refusé. Votre rôle (${req.user.role}) n\'est pas autorisé pour cette action.`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Rôles avec accès complet (admin/directeur)
 */
const adminRoles = ['admin', 'directeur'];

/**
 * Rôles de gestion (management)
 */
const managementRoles = ['admin', 'directeur', 'chef_projet', 'chef_chantier'];

/**
 * Middleware d'audit automatique
 * @param {string} module - Module concerné
 * @param {string} action - Action effectuée
 */
const auditLog = (module, action) => {
  return asyncHandler(async (req, res, next) => {
    // Injecter les infos d'audit pour le controller
    req.auditInfo = {
      module,
      action,
      user: req.user?._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
    next();
  });
};

/**
 * Logger l'action après la réponse
 */
const logAction = async (userId, action, module, description, resourceId = null, oldValue = null, newValue = null, ipAddress = null) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      module,
      resourceId,
      description,
      oldValue,
      newValue,
      ipAddress,
      status: 'success',
    });
  } catch (error) {
    // Ne pas bloquer la requête si le log échoue
    console.error('Erreur audit log:', error);
  }
};

module.exports = {
  protect,
  restrictTo,
  adminRoles,
  managementRoles,
  auditLog,
  logAction,
};
