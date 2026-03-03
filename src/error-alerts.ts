import { logger } from './logger.js';

let sendMessageFunc: ((jid: string, text: string) => Promise<void>) | null =
  null;
let adminJid: string | null = null;

/**
 * Initialize error alerting with the channel's sendMessage function
 * and the admin's JID to send alerts to
 */
export function initErrorAlerts(
  sendMessage: (jid: string, text: string) => Promise<void>,
  jid: string,
) {
  sendMessageFunc = sendMessage;
  adminJid = jid;
  logger.info({ jid }, 'Error alerts initialized');
}

/**
 * Send a critical error alert to the admin
 */
export async function sendErrorAlert(error: Error, context?: string) {
  if (!sendMessageFunc || !adminJid) {
    logger.warn('Error alerts not initialized, cannot send alert');
    return;
  }

  try {
    const contextStr = context ? `\n\nContext: ${context}` : '';
    const message = `🚨 CRITICAL ERROR\n\n${error.message}${contextStr}\n\nCheck logs/errors.log for details.`;

    await sendMessageFunc(adminJid, message);
    logger.info('Error alert sent to admin');
  } catch (err) {
    logger.error({ err }, 'Failed to send error alert');
  }
}
