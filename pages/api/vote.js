import pool from "./db.js"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { reviewId, voteType } = req.body

    try {
      const client = await pool.connect()

      if (voteType === "upvote") {
        const result = await client.query(
          "UPDATE reviews SET upvotes = upvotes + 1 WHERE review_id = $1",
          [reviewId]
        )
        console.log("Upvoted review with ID:", reviewId, "Result:", result)
      } else if (voteType === "downvote") {
        const result = await client.query(
          "UPDATE reviews SET downvotes = downvotes + 1 WHERE review_id = $1",
          [reviewId]
        )
        //console.log("Downvoted review with ID:", reviewId, "Result:", result)
      }

      client.release()
      res.status(200).json({ message: "Vote recorded successfully" })
    } catch (error) {
      console.error("Database error:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" })
  }
}
