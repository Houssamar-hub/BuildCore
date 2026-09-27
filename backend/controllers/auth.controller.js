'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logAction } = require('../middleware/auth');

/**
 * Générer un token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Générer un refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

/**
 * Envoyer token dans la réponse
 */
const sendTokenResponse = (user, statusCode, res, message = 'Succès') => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Supprimer le mot de passe de la réponse
  user.password = undefined;
  user.refreshToken = undefined;

  sendSuccess(res, statusCode, message, {
    token,
    refreshToken,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      preferences: user.preferences,
    },
  });
};

/**
 * @desc    Connexion utilisateur
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email et mot de passe requis.', 400));
  }

  // Trouver l'utilisateur avec le mot de passe
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Email ou mot de passe incorrect.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Votre compte a été désactivé. Contactez l\'administrateur.', 401));
  }

  // Mettre à jour lastLogin
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Audit log
  await logAction(user._id, 'LOGIN', 'Auth', `Connexion: ${user.email}`, null, null, null, req.ip);

  sendTokenResponse(user, 200, res, 'Connexion réussie.');
});

/**
 * @desc    Créer un compte utilisateur (admin seulement)
 * @route   POST /api/v1/auth/register
 * @access  Admin
 */
exports.register = asyncHandler(async (req, res, next) => {
  // Seuls les admins peuvent créer des utilisateurs
  if (!['admin', 'directeur'].includes(req.user.role)) {
    return next(new AppError('Action non autorisée.', 403));
  }

  const { firstName, lastName, email, password, role, phone } = req.body;

  // Vérifier que l'email n'existe pas déjà
  const existingUser = await User.findOne({ email: email?.toLowerCase() });
  if (existingUser) {
    return next(new AppError('Un compte avec cet email existe déjà.', 409));
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'employe',
    phone,
    createdBy: req.user._id,
  });

  await logAction(req.user._id, 'CREATE', 'User', `Création utilisateur: ${newUser.email}`, newUser._id, null, { email, role }, req.ip);

  sendSuccess(res, 201, 'Compte créé avec succès.', {
    user: {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

/**
 * @desc    Déconnexion
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  await logAction(req.user._id, 'LOGOUT', 'Auth', `Déconnexion: ${req.user.email}`, null, null, null, req.ip);
  sendSuccess(res, 200, 'Déconnexion réussie.');
});

/**
 * @desc    Obtenir le profil courant
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('employeeRef', 'profession currentProject');
  sendSuccess(res, 200, 'Profil récupéré.', user);
});

/**
 * @desc    Changer le mot de passe
 * @route   PATCH /api/v1/auth/update-password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Mot de passe actuel et nouveau requis.', 400));
  }

  if (newPassword.length < 8) {
    return next(new AppError('Le nouveau mot de passe doit contenir au moins 8 caractères.', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Mot de passe actuel incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  await logAction(req.user._id, 'UPDATE', 'Auth', 'Changement de mot de passe', null, null, null, req.ip);

  sendTokenResponse(user, 200, res, 'Mot de passe mis à jour avec succès.');
});

/**
 * @desc    Mettre à jour le profil
 * @route   PATCH /api/v1/auth/update-profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'preferences'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  await logAction(req.user._id, 'UPDATE', 'User', 'Mise à jour profil', req.user._id, null, updates, req.ip);

  sendSuccess(res, 200, 'Profil mis à jour.', user);
});

/**
 * @desc    Rafraîchir le token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token requis.', 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new AppError('Refresh token invalide ou expiré.', 401));
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return next(new AppError('Utilisateur non trouvé ou désactivé.', 401));
  }

  const newToken = generateToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  sendSuccess(res, 200, 'Token rafraîchi.', { token: newToken, refreshToken: newRefreshToken });
});
