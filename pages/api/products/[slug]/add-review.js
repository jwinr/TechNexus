import pool from "../../db.js"

export default async (req, res) => {
  const { slug } = req.query

  try {
    // Query the database to retrieve product name and slug by id (passed as slug)
    const productQuery = `
    SELECT p.name, p.slug, p.product_id
    FROM products p
    WHERE p.product_id = $1
    `
    const productQueryResult = await pool.query(productQuery, [slug])
    const product = productQueryResult.rows[0]

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Fetch the main product image for the product based on product_id
    const mainImageQuery = `
    SELECT image_url, is_main
    FROM images
    WHERE product_id = $1;
    `
    const mainImageQueryResult = await pool.query(mainImageQuery, [
      product.product_id,
    ])
    const mainImage = mainImageQueryResult.rows[0]

    // Combine the product name, slug, and main image data
    const productWithMainImage = {
      ...product,
      image: mainImage ? mainImage.image_url : null,
    }

    // Send the product data as a JSON response
    res.json(productWithMainImage)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
