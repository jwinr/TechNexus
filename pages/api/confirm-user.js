import { CognitoIdentityServiceProvider } from "aws-sdk"

// Function to allow users to sign-in without confirming their account via the adminConfirmSignUp API
export default async function handler(req, res) {
  const { username } = req.body

  const cognito = new CognitoIdentityServiceProvider({
    region: "us-east-2",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })

  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  }

  try {
    await cognito.adminConfirmSignUp(params).promise()
    res.status(200).json({ message: "User confirmed successfully" })
  } catch (error) {
    console.error("Error confirming user:", error)
    res.status(500).json({ message: "Error confirming user", error })
  }
}
