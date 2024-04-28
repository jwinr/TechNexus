import { Pool } from "pg"
import { config } from "../../utils/config"

const pool = new Pool({
  connectionString: config.databaseCreds,
})

export default pool
