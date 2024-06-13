import { query } from "./db"

export default async function handler(req, res) {
  const { method } = req

  if (method === "POST") {
    const { cognitoSub, email, familyName, givenName } = req.body

    try {
      // Check if user already exists
      let user = await query(
        "SELECT user_id FROM users WHERE cognito_sub = $1",
        [cognitoSub]
      )

      if (user.length > 0) {
        // User already exists
        return res
          .status(200)
          .json({ message: "User already exists", userId: user[0].user_id })
      } else {
        // Insert new user
        user = await query(
          "INSERT INTO users (cognito_sub, email, last_name, first_name) VALUES ($1, $2, $3, $4) RETURNING user_id",
          [cognitoSub, email, familyName, givenName]
        )
        return res
          .status(201)
          .json({ message: "User created", userId: user[0].user_id })
      }
    } catch (error) {
      console.error("Error creating or fetching user:", error.stack)
      return res.status(500).json({
        error: "Error creating or fetching user",
        details: error.message,
      })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
