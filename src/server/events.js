const childProcess = require('child_process');
const logger = require('../helpers/logger');
const pJson = require('../../package.json');

const revision = childProcess
  .execSync('git rev-parse HEAD')
  .toString().trim();

/**
 * @function
 * @param  {NodeJS.ErrnoException} error
 * @returns throw error
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      logger.error('Port requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error('Port is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * @function
 * @inner
 * @description log port to console
 */
function onListening() {
  const addr = this.address();
  const bindStr = (typeof addr === 'string')
    ? `Listening on pipe ${addr}`
    : `Listening on [http://localhost:${addr.port}/]`;

  logger.info(bindStr, {
    package: { version: pJson.version },
    git: { revision },
  });
}

/**
 * @function
 * @inner
 * @param {http.Server} server
 */
function bindServer(server) {
  server.on('error', (error) => onError.bind(server)(error));
  server.on('listening', onListening.bind(server));
}

module.exports = {
  bindServer,
};
