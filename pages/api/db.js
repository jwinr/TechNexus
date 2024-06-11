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

export default pool
