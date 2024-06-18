import { LRUCache } from "lru-cache"

export default function rateLimit(options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500, // Max 500 unique tokens per interval
    ttl: options?.interval || 60000, // Time to live in ms (1 minute)
  })

  return {
    check: (limit, token) =>
      new Promise((resolve, reject) => {
        let tokenCount = tokenCache.get(token) || [0] // Make sure tokenCount is initialized
        tokenCount[0] += 1 // Increment request count for this token

        tokenCache.set(token, tokenCount, { ttl: options?.interval || 60000 })

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage > limit

        if (isRateLimited) {
          reject(new Error("Rate limit exceeded"))
        } else {
          resolve({
            isLimited: false,
            remaining: limit - currentUsage,
          })
        }
      }),
  }
}
