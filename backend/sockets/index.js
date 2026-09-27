'use strict';

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const User = require('../models/User');

let io;

/**
 * Initialise Socket.io sur le serveur HTTP
 * @param {http.Server} server - Serveur HTTP
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware d'authentification Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentification requise'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        return next(new Error('Utilisateur non autorisé'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    logger.info(`🔌 Connexion Socket: ${socket.user.fullName} (${socket.id})`);

    // Rejoindre la room personnelle
    socket.join(`user:${userId}`);

    // Rejoindre la room du rôle
    socket.join(`role:${socket.user.role}`);

    // Ping/pong
    socket.on('ping', () => socket.emit('pong'));

    // Rejoindre une room projet
    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      logger.info(`📁 ${socket.user.fullName} rejoint projet ${projectId}`);
    });

    // Quitter une room projet
    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    // Déconnexion
    socket.on('disconnect', (reason) => {
      logger.info(`🔌 Déconnexion Socket: ${socket.user.fullName} - Raison: ${reason}`);
    });
  });

  logger.info('✅ Socket.io initialisé');
  return io;
};

/**
 * Obtenir l'instance Socket.io
 * @returns {Server} Instance Socket.io
 */
const getIO = () => {
  if (!io) throw new Error('Socket.io non initialisé');
  return io;
};

/**
 * Émettre une notification à un utilisateur
 * @param {string} userId - ID utilisateur
 * @param {string} event - Nom de l'événement
 * @param {object} data - Données
 */
const emitToUser = (userId, event, data) => {
  if (io) io.to(`user:${userId}`).emit(event, data);
};

/**
 * Émettre à tous les utilisateurs d'un rôle
 * @param {string} role - Rôle
 * @param {string} event - Événement
 * @param {object} data - Données
 */
const emitToRole = (role, event, data) => {
  if (io) io.to(`role:${role}`).emit(event, data);
};

/**
 * Émettre à tous les membres d'un projet
 * @param {string} projectId - ID projet
 * @param {string} event - Événement
 * @param {object} data - Données
 */
const emitToProject = (projectId, event, data) => {
  if (io) io.to(`project:${projectId}`).emit(event, data);
};

/**
 * Diffuser à tous les utilisateurs connectés
 * @param {string} event - Événement
 * @param {object} data - Données
 */
const broadcast = (event, data) => {
  if (io) io.emit(event, data);
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToRole,
  emitToProject,
  broadcast,
};
