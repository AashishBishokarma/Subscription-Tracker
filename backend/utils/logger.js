const getCallerInfo = () => {
  const error = new Error();
  const stack = error.stack.split('\n');
  // The stack trace usually looks like:
  // 0: Error
  // 1: at getCallerInfo (this function)
  // 2: at logFunction (e.g., info, error)
  // 3: at callerFunction (the function that called logFunction)
  // 4: at callerFile (the file where callerFunction is)
  const callerLine = stack[4];
  if (!callerLine) return 'Unknown Location';

  // Extract file path and function name
  const match = callerLine.match(/\s*at\s*(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+)|(.+?))?\)?$/);
  if (match) {
    const functionName = match[1] || 'anonymous';
    const filePath = match[2] || match[5];
    const lineNumber = match[3];
    if (filePath && lineNumber) {
      const fileName = filePath.split('/').pop();
      return `${fileName}:${functionName}:${lineNumber}`;
    } else if (filePath) {
      const fileName = filePath.split('/').pop();
      return `${fileName}:${functionName}`;
    }
  }
  return 'Unknown Location';
};

const log = (level, message, ...args) => {
  const timestamp = new Date().toISOString();
  const callerInfo = getCallerInfo();
  console.log(`[${timestamp}] [${level.toUpperCase()}] [${callerInfo}] ${message}`, ...args);
};

module.exports = {
  info: (message, ...args) => log('info', message, ...args),
  error: (message, ...args) => log('error', message, ...args),
  warn: (message, ...args) => log('warn', message, ...args),
  debug: (message, ...args) => log('debug', message, ...args),
};
