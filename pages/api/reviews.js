import pool from "./db.js"

export default async function handler(req, res) {
  const { method } = req

  if (method === "POST") {
    const { reviewId, voteType, title, text, rating, cognitoSub, productId } =
      req.body

    try {
      const client = await pool.connect()

      // Fetch user_id using cognitoSub
      const userResult = await client.query(
        "SELECT user_id FROM users WHERE cognito_sub = $1",
        [cognitoSub]
      )

      if (userResult.rows.length === 0) {
        client.release()
        return res.status(404).json({ error: "User not found" })
      }

      const userId = userResult.rows[0].user_id

      if (voteType) {
        // Handle voting
        if (voteType === "upvote") {
          const result = await client.query(
            "UPDATE reviews SET upvotes = upvotes + 1 WHERE review_id = $1",
            [reviewId]
          )
        } else if (voteType === "downvote") {
          const result = await client.query(
            "UPDATE reviews SET downvotes = downvotes + 1 WHERE review_id = $1",
            [reviewId]
          )
        }
      } else if (title && text && rating && productId) {
        // Check for existing review
        const existingReview = await client.query(
          "SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2",
          [userId, productId]
        )

        if (existingReview.rows.length > 0) {
          client.release()
          return res.status(400).json({
            error: "You have already submitted a review for this item!",
          })
        }

        // Handle review submission
        try {
          const result = await client.query(
            "INSERT INTO reviews (title, text, rating, user_id, product_id, review_date) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
            [title, text, rating, userId, productId]
          )
        } catch (sqlError) {
          console.error("SQL error during review submission:", sqlError)
          res.status(500).json({
            error: "SQL error during review submission",
            details: sqlError.message,
          })
        }
      }

      client.release()
      res.status(200).json({ message: "Operation completed successfully" })
    } catch (error) {
      console.error("Database error:", error)
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message })
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" })
  }
}
