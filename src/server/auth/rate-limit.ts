type RateLimitEntry = {
  count: number
  resetAt: number
}

const MAX_ATTEMPTS = 5
const WINDOW_MS = 60_000

const attempts = new Map<string, RateLimitEntry>()

export function checkRateLimit(key: string): { allowed: boolean } {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false }
  }

  entry.count += 1
  return { allowed: true }
}
