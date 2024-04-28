import { CognitoIdentityServiceProvider } from "aws-sdk"
import { config } from "../../utils/config"
import jwt from "jsonwebtoken"

// Initialize AWS Cognito SDK
const cognito = new CognitoIdentityServiceProvider()

// Use the cognitoUserPoolId from the config object
const userPoolId = config.cognitoUserPoolId
const JWT_SECRET = config.jwtSecret

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const token = req.body.token

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Check if the token has expired
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: "Unauthorized: Token has expired" })
    }

    // Extract user information from the decoded token payload
    const { sub: userId, username } = decoded

    // Check if the user exists in AWS Cognito
    const params = {
      UserPoolId: userPoolId,
      Filter: `sub = "${userId}"`, // Filter users by their Cognito user ID (sub)
      Limit: 1, // There should only be one user with the given ID
    }

    const data = await cognito.listUsers(params).promise()

    if (data.Users.length === 0) {
      return res.status(401).json({ error: "Unauthorized: User not found" })
    }

    // Authentication successful, respond with user information
    res
      .status(200)
      .json({ userId, username, message: "Authentication successful" })
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" })
  }
}
