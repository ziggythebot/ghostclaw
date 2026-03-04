import pino from 'pino';
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'info',
        options: { colorize: true },
      },
      {
        target: 'pino/file',
        level: 'error',
        options: { destination: path.join(logsDir, 'errors.log') },
      },
    ],
  },
});

// Import error alerts (avoid circular dependency by importing dynamically)
async function handleCriticalError(err: Error, context: string) {
  try {
    const { sendErrorAlert } = await import('./error-alerts.js');
    await sendErrorAlert(err, context);
  } catch (alertErr) {
    // Ignore if error alerts not initialized yet
  }
}

// Route uncaught errors through pino so they get timestamps in stderr
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  handleCriticalError(err, 'Uncaught exception').finally(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logger.error({ err: reason }, 'Unhandled rejection');
  // Don't alert the user on transient rejections (connection drops, timeouts, etc.)
  // These are logged but not worth waking someone up over.
  // Only uncaughtExceptions (which crash the process) send alerts.
});
