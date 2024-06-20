import { NextResponse } from "next/server"
import rateLimit from "./utils/RateLimiter"

const rateLimiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
})

const isDevelopment = process.env.NODE_ENV === "development"

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
}

const securityHeaders = {
  "Content-Security-Policy": `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDevelopment ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    connect-src 'self' ${
      isDevelopment ? "ws://127.0.0.1:* ws://localhost:*" : ""
    };
  `
    .replace(/\s{2,}/g, " ")
    .trim(),
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "geolocation=(self), microphone=()",
}

export async function middleware(req) {
  const { nextUrl: url, geo, headers } = req
  const apiKey = headers.get("x-api-key")

  // Extract the IP address
  const ip =
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",").shift() ||
    req.ip ||
    "::1"

  // Use a higher limit for development
  const isLocalhost = ip === "::1"
  const limit = isLocalhost ? 5000 : 10

  try {
    const rateLimiterResponse = await rateLimiter.check(limit, ip)
    const res = NextResponse.next()
    res.headers.set("X-RateLimit-Limit", limit)
    res.headers.set("X-RateLimit-Remaining", rateLimiterResponse.remaining)

    Object.keys(corsHeaders).forEach((key) => {
      res.headers.set(key, corsHeaders[key])
    })
    Object.keys(securityHeaders).forEach((key) => {
      res.headers.set(key, securityHeaders[key])
    })

    if (rateLimiterResponse.isLimited) {
      throw new Error("Rate limit exceeded")
    }
  } catch (error) {
    return new NextResponse("Too Many Requests. Please try again later.", {
      status: 429,
      headers: { ...corsHeaders, ...securityHeaders },
    })
  }

  if (
    url.pathname.startsWith("/api/") &&
    apiKey !== process.env.NEXT_PUBLIC_API_KEY
  ) {
    return new NextResponse("Access Forbidden.", {
      status: 403,
      headers: { ...corsHeaders, ...securityHeaders },
    })
  }

  const res = NextResponse.next()
  Object.keys(corsHeaders).forEach((key) => {
    res.headers.set(key, corsHeaders[key])
  })
  Object.keys(securityHeaders).forEach((key) => {
    res.headers.set(key, securityHeaders[key])
  })

  return res
}
