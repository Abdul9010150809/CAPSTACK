import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const formatMessage = (level: string, data: any): string => {
  const timestamp = getTimestamp();
  if (typeof data === 'string') {
    return `[${timestamp}] [${level}] ${data}`;
  }
  return `[${timestamp}] [${level}] ${JSON.stringify(data, null, 2)}`;
};

const writeLog = (level: string, data: any): void => {
  const message = formatMessage(level, data);
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
  const allLogsFile = path.join(logsDir, 'all.log');

  // Write to level-specific file
  fs.appendFileSync(logFile, message + '\n', { encoding: 'utf8' });
  // Write to all logs file
  fs.appendFileSync(allLogsFile, message + '\n', { encoding: 'utf8' });
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console[level.toLowerCase() as keyof typeof console](message);
  }
};

export const logger = {
  info: (message: string | object) => {
    writeLog('INFO', message);
  },
  error: (message: string | object) => {
    writeLog('ERROR', message);
  },
  warn: (message: string | object) => {
    writeLog('WARN', message);
  },
  debug: (message: string | object) => {
    if (process.env.NODE_ENV === 'development') {
      writeLog('DEBUG', message);
    }
  },
};