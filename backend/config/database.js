'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB
 * Handles connection retries and logs connection state
 */
const connectDB = async () => {
  const mongoUri = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI
    : process.env.MONGO_URI || 'mongodb://localhost:27017/imara360';

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    logger.info(`✅ MongoDB connecté: ${conn.connection.host}`);

    // Gestion des événements de connexion
    mongoose.connection.on('error', (err) => {
      logger.error(`❌ Erreur MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB déconnecté. Tentative de reconnexion...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnecté.');
    });

  } catch (error) {
    logger.error(`❌ Connexion MongoDB échouée: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
