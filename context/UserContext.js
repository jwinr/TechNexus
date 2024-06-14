import React, { createContext, useState, useEffect, useCallback } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import { Hub } from "aws-amplify/utils"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userAttributes, setUserAttributes] = useState(null)
  const [authChecked, setAuthChecked] = useState(false) // Track if initial authentication check is completed

  // Memoized function to fetch user attributes and set them in state
  const fetchUserAttributes = useCallback(async () => {
    try {
      const session = await fetchAuthSession()
      if (session && session.tokens && session.tokens.idToken) {
        const idTokenPayload = session.tokens.idToken.payload

        localStorage.setItem("userAttributes", JSON.stringify(idTokenPayload))
        setUserAttributes(idTokenPayload)

        // Send user data to the backend to create/update user record
        await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cognitoSub: idTokenPayload.sub,
            email: idTokenPayload.email,
            familyName: idTokenPayload.family_name,
            givenName: idTokenPayload.given_name,
          }),
        })
      }
    } catch (error) {
      console.error("Error fetching user session:", error)
    }
  }, []) // Empty dependency array to make sure this function is only created once

  useEffect(() => {
    const storedUserAttributes = localStorage.getItem("userAttributes")
    if (storedUserAttributes) {
      // If user attributes are found in local storage, set them in state
      setUserAttributes(JSON.parse(storedUserAttributes))
      setAuthChecked(true) // Mark authentication check as completed
    } else {
      // If not found in local storage, fetch user attributes from server
      fetchUserAttributes().then(() => setAuthChecked(true))
    }

    // Start listening for messages
    const hubListenerCancelToken = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          fetchUserAttributes() // Fetch user attributes on sign-in
          break
        case "signedOut":
          localStorage.removeItem("userAttributes") // Remove user attributes from local storage on sign-out
          setUserAttributes(null) // Clear user attributes from state
          break
        case "tokenRefresh":
          fetchUserAttributes() // Fetch user attributes on token refresh
          break
        default:
          break
      }
    })

    // Stop listening for messages
    return () => {
      hubListenerCancelToken()
    }
  }, [fetchUserAttributes]) // Re-run effect only if fetchUserAttributes changes

  return (
    <UserContext.Provider value={{ userAttributes, fetchUserAttributes }}>
      {children}
    </UserContext.Provider>
  )
}
