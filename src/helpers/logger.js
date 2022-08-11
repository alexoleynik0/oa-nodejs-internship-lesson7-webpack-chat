const path = require('path');
const winston = require('winston');

// TODO: make it fly
// NOTE: this works like shit somehow..
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors({ stack: true }),
  ),
  defaultMeta: { },
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../logs/winston', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../logs/winston', 'combined.log'),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

module.exports = logger;
