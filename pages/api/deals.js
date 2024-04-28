import pool from "./db.js"

export default async (req, res) => {
  try {
    const client = await pool.connect()

    const result = await client.query(`
      SELECT deals.*, images.image_url, products.name, products.price, products.slug
      FROM deals
      LEFT JOIN images ON deals.product_id = images.product_id AND images.is_main = true
      LEFT JOIN products ON deals.product_id = products.product_id
    `)

    const deals = result.rows

    client.release()
    res.status(200).json(deals)
  } catch (error) {
    console.error("Database error:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
