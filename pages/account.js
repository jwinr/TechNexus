import React, { useEffect, useState } from "react"
import { fetchAuthSession, signOut } from "aws-amplify/auth"
import { useRouter } from "next/router"
import styled from "styled-components"
import Image from "next/image"
import LogoSymbol from "../public/logo_n.png"

const AccountContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`

const InfoContainer = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const InfoItem = styled.div`
  margin-bottom: 10px;
  font-size: 1.1rem;
`

const LogoutButton = styled.button`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: var(--sc-color-blue);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: var(--sc-color-dark-blue);
  }
`

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  width: 140px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    max-width: 75px;
    width: auto;
  }
`

const Account = () => {
  const [userAttributes, setUserAttributes] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAttributes = async () => {
      try {
        const session = await fetchAuthSession()
        const idTokenPayload = session.tokens.idToken.payload

        // Store user attributes in local storage to prevent unnecessary API calls
        localStorage.setItem("userAttributes", JSON.stringify(idTokenPayload))
        setUserAttributes(idTokenPayload)
      } catch (error) {
        console.error("Error fetching user session:", error)
        router.push("/login") // Redirect to login if user is not authenticated
      }
    }

    // Check local storage for existing user attributes
    const storedUserAttributes = localStorage.getItem("userAttributes")
    if (storedUserAttributes) {
      setUserAttributes(JSON.parse(storedUserAttributes))
    } else {
      fetchUserAttributes()
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.removeItem("userAttributes") // Remove user attributes from local storage on logout
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!userAttributes) {
    return <p>Loading...</p>
  }

  const { "cognito:username": username, email, given_name } = userAttributes

  return (
    <AccountContainer>
      <LogoBox>
        <Image src={LogoSymbol} alt="TechNexus Logo" priority={true} />
      </LogoBox>
      <Header>Account</Header>
      <InfoContainer>
        <InfoItem>
          <strong>Username:</strong> {username}
        </InfoItem>
        <InfoItem>
          <strong>Email:</strong> {email}
        </InfoItem>
        <InfoItem>
          <strong>Given Name:</strong> {given_name}
        </InfoItem>
      </InfoContainer>
      <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
    </AccountContainer>
  )
}

export default Account
