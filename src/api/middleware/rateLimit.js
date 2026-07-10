/**
 * rateLimit — Rate limiter básico en memoria para el proxy serverless.
 *
 * OWASP Top 10 (Módulo 3): Protección contra abuso de endpoints.
 */

export class RateLimiter {
  constructor(maxRequests = 20, windowMs = 60000) {
    this._maxRequests = maxRequests
    this._windowMs = windowMs
    this._clients = new Map()
  }

  check(clientIp) {
    const now = Date.now()
    const record = this._clients.get(clientIp) || { count: 0, resetAt: now + this._windowMs }

    if (now > record.resetAt) {
      record.count = 0
      record.resetAt = now + this._windowMs
    }

    record.count += 1

    if (record.count > this._maxRequests) {
      return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
    }

    this._clients.set(clientIp, record)
    return { allowed: true }
  }

  reset() {
    this._clients.clear()
  }
}
