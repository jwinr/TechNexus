import React, { createContext, useState, useEffect } from "react"
import { fetchAuthSession } from "aws-amplify/auth"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userAttributes, setUserAttributes] = useState(null)

  useEffect(() => {
    const fetchUserAttributes = async () => {
      try {
        const session = await fetchAuthSession()
        const idTokenPayload = session.tokens.idToken.payload

        // Store user attributes in local storage to prevent unnecessary API calls
        // The obvious limitation here is that it wouldn't work as expected if the user clears their local storage,
        // but it works well enough for this use case.
        console.log("Fetched from API:", idTokenPayload)
        localStorage.setItem("userAttributes", JSON.stringify(idTokenPayload))
        setUserAttributes(idTokenPayload)
      } catch (error) {
        console.error("Error fetching user session:", error)
        // Redirect to login if user is not authenticated
      }
    }

    // Check local storage for existing user attributes
    const storedUserAttributes = localStorage.getItem("userAttributes")
    if (storedUserAttributes) {
      console.log(
        "Loaded from local storage:",
        JSON.parse(storedUserAttributes)
      )
      setUserAttributes(JSON.parse(storedUserAttributes))
    } else {
      fetchUserAttributes()
    }
  }, [])

  return (
    <UserContext.Provider value={userAttributes}>
      {children}
    </UserContext.Provider>
  )
}
