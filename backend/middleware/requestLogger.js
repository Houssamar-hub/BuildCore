'use strict';

const morgan = require('morgan');
const logger = require('../utils/logger');

// Format Morgan → Winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Skip les logs en test
const skip = () => process.env.NODE_ENV === 'test';

const morganMiddleware = morgan(
  process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
  { stream, skip }
);

module.exports = morganMiddleware;
