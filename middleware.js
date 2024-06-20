import { NextResponse } from "next/server"
import rateLimit from "./utils/RateLimiter"

const rateLimiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
})

export async function middleware(req) {
  const { nextUrl: url, geo, headers } = req
  const apiKey = headers.get("x-api-key")

  // Extract the IP address
  const ip =
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",").shift() ||
    req.ip ||
    "::1"
  // console.log(`Middleware Log - Incoming request from IP: ${ip}`)

  // Use a higher limit for development
  const isLocalhost = ip === "::1"
  const limit = isLocalhost ? 5000 : 10

  try {
    const rateLimiterResponse = await rateLimiter.check(limit, ip)
    const res = NextResponse.next()
    res.headers.set("X-RateLimit-Limit", limit)
    res.headers.set("X-RateLimit-Remaining", rateLimiterResponse.remaining)
    if (rateLimiterResponse.isLimited) {
      throw new Error("Rate limit exceeded")
    }
  } catch (error) {
    return new NextResponse("Too Many Requests. Please try again later.", {
      status: 429,
    })
  }

  if (
    url.pathname.startsWith("/api/") &&
    apiKey !== process.env.NEXT_PUBLIC_API_KEY
  ) {
    return new NextResponse("Access Forbidden.", { status: 403 })
  }

  return NextResponse.next()
}
