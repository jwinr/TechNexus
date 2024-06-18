import { Pool } from "pg"
import rateLimit from "../../utils/RateLimiter"

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  )
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
})

export const query = async (text, params, token, res) => {
  // Rate limiting check
  try {
    await limiter.check(res, 10, token)
  } catch (err) {
    throw new Error("Rate limit exceeded")
  }

  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } catch (err) {
    console.error("Database query error", err.stack)
    throw err
  } finally {
    client.release()
  }
}

export default pool
