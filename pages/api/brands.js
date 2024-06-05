import pool from "./db.js"

export default async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT image, name FROM brand_images LIMIT 6"
    )
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" })
  }
}
