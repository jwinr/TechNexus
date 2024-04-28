// utils/config.js

import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// Export environment variables
export const config = {
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  databaseCreds: process.env.DATABASE_URL,
}
