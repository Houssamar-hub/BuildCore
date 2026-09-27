'use strict';

require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const { initSocket } = require('./sockets');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Créer le serveur HTTP
const server = http.createServer(app);

// Initialiser Socket.io
initSocket(server);

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Fermeture en cours...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Fermeture en cours...');
  logger.error(`${err.name}: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu. Fermeture gracieuse...');
  server.close(() => {
    logger.info('Serveur fermé.');
    process.exit(0);
  });
});

// Connecter MongoDB puis démarrer le serveur
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      logger.info('═══════════════════════════════════════════');
      logger.info(`  IMARA 360 API démarrée`);
      logger.info(`  Environnement : ${NODE_ENV}`);
      logger.info(`  Port          : ${PORT}`);
      logger.info(`  URL           : http://localhost:${PORT}`);
      logger.info(`  API           : http://localhost:${PORT}/api/v1`);
      logger.info('═══════════════════════════════════════════');
    });
  } catch (error) {
    logger.error(`Impossible de démarrer le serveur: ${error.message}`);
    process.exit(1);
  }
};

startServer();
