// /pages/api/cart.js

import { query } from "./db"

export default async function handler(req, res) {
  const { method } = req

  if (method === "GET") {
    const { cognitoSub } = req.query
    try {
      const user = await query(
        "SELECT user_id FROM users WHERE cognito_sub = $1",
        [cognitoSub]
      )
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" })
      }

      const cartItems = await query(
        `SELECT 
          c.cart_id, 
          c.product_id, 
          p.name AS product_name, 
          p.price AS product_price, 
          c.quantity,
          i.image_url AS product_image_url
        FROM 
          cart c 
        JOIN 
          products p ON c.product_id = p.product_id 
        LEFT JOIN 
          images i ON p.product_id = i.product_id AND i.is_main = TRUE
        WHERE 
          c.user_id = $1`,
        [user[0].user_id]
      )
      res.status(200).json(cartItems)
    } catch (error) {
      console.error("Error fetching cart:", error)
      res
        .status(500)
        .json({ error: "Error fetching cart", details: error.message })
    }
  } else if (method === "POST") {
    const { cognitoSub, productId, quantity } = req.body
    try {
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
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity",
        [user[0].user_id, productId, quantity]
      )
      res.status(200).json({ message: "Product added to cart" })
    } catch (error) {
      console.error("Error adding product to cart:", error)
      res
        .status(500)
        .json({ error: "Error adding product to cart", details: error.message })
    }
  } else if (method === "DELETE") {
    const { cognitoSub, productId } = req.body
    try {
      const user = await query(
        "SELECT user_id FROM users WHERE cognito_sub = $1",
        [cognitoSub]
      )
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" })
      }
      await query("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [
        user[0].user_id,
        productId,
      ])
      res.status(200).json({ message: "Product removed from cart" })
    } catch (error) {
      console.error("Error removing product from cart:", error)
      res.status(500).json({
        error: "Error removing product from cart",
        details: error.message,
      })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
