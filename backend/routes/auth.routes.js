'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Créer un nouveau compte utilisateur
 * @access  Admin uniquement
 */
router.post('/register', protect, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Déconnexion
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   PATCH /api/v1/auth/update-password
 * @desc    Changer le mot de passe
 * @access  Private
 */
router.patch('/update-password', protect, authController.updatePassword);

/**
 * @route   PATCH /api/v1/auth/update-profile
 * @desc    Mettre à jour le profil
 * @access  Private
 */
router.patch('/update-profile', protect, authController.updateProfile);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Rafraîchir le token JWT
 * @access  Public
 */
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
