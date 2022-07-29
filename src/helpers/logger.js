const TAKE_N_FIRST_FROM_STACK = 2;
function trimError(error) {
  const errorStackAsArray = error.stack.split('\n');
  return errorStackAsArray
    .splice(0, Math.min(TAKE_N_FIRST_FROM_STACK, errorStackAsArray.length))
    .join('\n');
}

function logger(dataToLog, context = '', logLevel = 'log') {
  const timeStr = (new Date()).toJSON();

  let logStr = `[${timeStr}]:`;

  if (context) {
    logStr += ` {{ ${context} }} `;
  }

  let logData = dataToLog;
  if (dataToLog instanceof Error) {
    logData = trimError(dataToLog);
  }

  console[logLevel](logStr, logData);
}

module.exports = logger;
