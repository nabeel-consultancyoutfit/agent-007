import { log } from './logger.js'

export async function alert(type, message, meta = {}) {
  log('error', 'alerts', message, { type, ...meta })

  const webhookUrl = process.env.WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message,
          meta,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      log('error', 'alerts', `Failed to send webhook alert: ${error.message}`, {
        type,
        webhookError: error.message
      })
    }
  }
}
