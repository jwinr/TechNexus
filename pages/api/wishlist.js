import { query } from "./db"

export default async function handler(req, res) {
  const { method } = req

  if (method === "GET") {
    // Fetch user's wishlist
    const { cognitoSub } = req.query
    try {
      const user = await query(
        "SELECT user_id FROM users WHERE cognito_sub = $1",
        [cognitoSub]
      )
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" })
      }
      const wishlist = await query(
        `SELECT product_id, product_name, product_price, product_image_url, product_brand, product_slug, product_rating 
         FROM wishlists WHERE user_id = $1`,
        [user[0].user_id]
      )
      res.status(200).json(wishlist)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message })
    }
  } else if (method === "POST") {
    // Add product to wishlist
    const {
      cognitoSub,
      productId,
      productName,
      productPrice,
      productBrand,
      productSlug,
      productRating,
      productImageUrl,
    } = req.body
    try {
      console.log(req.body) // Log the received data
      let user = await query(
        "SELECT user_id FROM users WHERE cognito_sub = $1",
        [cognitoSub]
      )
      if (user.length === 0) {
        await query("INSERT INTO users (cognito_sub) VALUES ($1)", [cognitoSub])
        user = await query("SELECT user_id FROM users WHERE cognito_sub = $1", [
          cognitoSub,
        ])
      }
      await query(
        `INSERT INTO wishlists (user_id, product_id, product_name, product_price, product_image_url, product_brand, product_slug, product_rating)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (user_id, product_id) DO NOTHING`,
        [
          user[0].user_id,
          productId,
          productName,
          productPrice,
          productImageUrl,
          productBrand,
          productSlug,
          productRating,
        ]
      )
      res.status(200).json({ message: "Product added to wishlist" })
    } catch (error) {
      console.error("Error adding product to wishlist:", error)
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message })
    }
  } else if (method === "DELETE") {
    // Remove product from wishlist
    const { cognitoSub, productId } = req.body
    try {
      const user = await query(
        "SELECT user_id FROM users WHERE cognito_sub = $1",
        [cognitoSub]
      )
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" })
      }
      await query(
        "DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2",
        [user[0].user_id, productId]
      )
      res.status(200).json({ message: "Product removed from wishlist" })
    } catch (error) {
      console.error("Error removing product from wishlist:", error)
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
