import { Pool } from "pg"

// Ensure environment variables are loaded
if (!process.env.DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  )
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const query = async (text, params) => {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res.rows
  } catch (err) {
    console.error("Database query error", err.stack)
    throw err
  } finally {
    client.release()
  }
}

export default pool
