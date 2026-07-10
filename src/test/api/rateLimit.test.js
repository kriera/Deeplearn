import { describe, expect, it, beforeEach } from 'vitest'
import { RateLimiter } from '../../api/middleware/rateLimit.js'

describe('RateLimiter', () => {
  let limiter

  beforeEach(() => {
    limiter = new RateLimiter(3, 60000) // 3 requests per minute for testing
  })

  it('allows requests within the limit', () => {
    expect(limiter.check('127.0.0.1').allowed).toBe(true)
    expect(limiter.check('127.0.0.1').allowed).toBe(true)
    expect(limiter.check('127.0.0.1').allowed).toBe(true)
  })

  it('blocks requests exceeding the limit', () => {
    limiter.check('127.0.0.1')
    limiter.check('127.0.0.1')
    limiter.check('127.0.0.1')
    const result = limiter.check('127.0.0.1')
    expect(result.allowed).toBe(false)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('tracks different IPs independently', () => {
    limiter.check('ip-a')
    limiter.check('ip-a')
    limiter.check('ip-a')
    expect(limiter.check('ip-a').allowed).toBe(false)
    expect(limiter.check('ip-b').allowed).toBe(true)
  })

  it('resets after the window expires', async () => {
    const fastLimiter = new RateLimiter(1, 50) // 1 request per 50ms
    fastLimiter.check('127.0.0.1')
    expect(fastLimiter.check('127.0.0.1').allowed).toBe(false)

    await new Promise((resolve) => setTimeout(resolve, 60))
    expect(fastLimiter.check('127.0.0.1').allowed).toBe(true)
  })

  it('reset() clears all client records', () => {
    limiter.check('127.0.0.1')
    limiter.check('127.0.0.1')
    limiter.check('127.0.0.1')
    limiter.reset()
    expect(limiter.check('127.0.0.1').allowed).toBe(true)
  })
})
