import React, { useState } from "react"
import { Auth } from "aws-amplify"
import * as Styled from "../components/auth/SignStyles"
import styled from "styled-components"
import LargeContainerFixed from "../components/common/LargeContainerFixed"
import { useRouter } from "next/router"
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import LogoSymbol from "../public/logo_n.svg"
import Head from "next/head"

const SignupPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 30px 30px 30px;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 23px;
  padding: 5px;
`

const NameWrapper = styled.div`
  margin-bottom: 10px;
`

const PasswordWrapper = styled.div`
  margin-bottom: 10px;
`

const AccountText = styled.label`
  display: block;
  font-size: 13px;
  color: #000;
  font-weight: 400;
  margin-bottom: 0.1rem;
`

const EntryContainer = styled.input`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #a1a1a1;
  border-radius: 0.25rem;
  width: 350px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: #333;
  line-height: 1.25;
  outline: none;
  padding-right: 40px;

  &.focus {
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
`

const InputIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const IconButton = styled.button`
  position: absolute;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
`

const EntryBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
`

const ValidationMessage = styled.div`
  display: inline-flex;
  position: absolute;
  color: red;
  font-size: 14px;
  font-weight: 600;
`

const SignInBtn = styled.button`
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in 0s;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px 0px;
  border-radius: 6px;
  padding: 8px 20px;
  color: #fff;
  border: medium;
  width: 350px;
  text-align: center;
  background-color: #00599c;
  transition: background-color 0.2s;

  &:hover {
    background-color: #002d62;
  }

  &:active {
    background-color: #002d62;
  }
`

const ResetText = styled.a`
  display: inline-block;
  margin-top: 10px;
  align-content: baseline;
  font-weight: 500;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  max-height: 100%;

  svg {
    width: auto;
    height: 40px;
  }

  @media (max-width: 768px) {
    .Tech_Haven {
      margin: 3px;
      grid-area: nav-logo;
    }
  }
`

const SignUpPage = ({ toggleSignUp }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [given_name, setFirstName] = useState("")
  const [family_name, setLastName] = useState("")
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("")
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true)
  const [emailValid, setEmailValid] = useState(true)
  const [firstNameValid, setFirstNameValid] = useState(true)
  const [lastNameValid, setLastNameValid] = useState(true)

  const [formData, setFormData] = useState({
    username: "",
    given_name: "",
    family_name: "",
    password: "",
  })

  const router = useRouter()

  const validateEmailDomain = (email) => {
    // Standard regex pattern for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validateFirstName = (given_name) => {
    // Regular expression pattern to validate the first name (accepts Unicode)
    const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
    return pattern.test(given_name)
  }

  const validateLastName = (family_name) => {
    // Regular expression pattern to validate the first name (accepts Unicode)
    const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
    return pattern.test(family_name)
  }

  const handleEmailBlur = () => {
    if (username.trim().length === 0) {
      // Reset email validity only if the field is empty when blurred
      setEmailValid(true)
    } else {
      setEmailValid(validateEmailDomain(username))
    }
  }

  const handleFirstNameBlur = () => {
    if (given_name.trim().length === 0) {
      // Reset name validity only if the field is empty when blurred
      setFirstNameValid(true)
    } else {
      setFirstNameValid(validateFirstName(given_name))
    }
  }

  const handleLastNameBlur = () => {
    if (family_name.trim().length === 0) {
      setLastNameValid(true)
    } else {
      setLastNameValid(validateLastName(family_name))
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === "username") {
      setUsername(value)
      setEmailValid(true) // Reset email validity when username changes
    } else if (name === "password") {
      setPassword(value)
      setPasswordValid(true) // Reset password validity when password changes
    } else if (name === "confirmPassword") {
      // Handle changes in confirm password field
      setConfirmPasswordValue(value)
      setConfirmPasswordValid(true)
    } else if (name === "given_name") {
      setFirstName(value)
      setFirstNameValid(true) // Reset first name validity when first name changes
    } else if (name === "family_name") {
      setLastName(value)
      setLastNameValid(true) // Reset last name validity when last name changes
    }
  }

  const handlePasswordBlur = () => {
    if (password.trim().length === 0) {
      // Reset password validity only if the field is empty when blurred
      setPasswordValid(true)
    } else {
      // Validate password if field is not empty
      setPasswordValid(validatePassword(password))
    }
  }

  const validatePassword = (password) => {
    // Regular expression pattern to validate the password
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-])[a-zA-Z0-9\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]{8,98}$/
    return pattern.test(password)
  }

  const handleConfirmPasswordBlur = () => {
    // Validate only if the password field has been touched
    if (confirmPasswordValue.trim() !== "") {
      if (password !== confirmPasswordValue) {
        setConfirmPasswordValid(false)
      } else {
        setConfirmPasswordValid(true)
      }
    }
  }

  // Apply red border/text if information is invalid
  const invalidStyle = { borderColor: "red", color: "red" }

  const signUp = async () => {
    const { username, given_name, family_name, password } = formData
    try {
      let formValid = true

      ;[
        // Flag to track overall form validity
        // Loop through the input fields
        (username, given_name, family_name, password),
      ].forEach((field, index) => {
        if (field.trim() === "") {
          // If the field is empty, set the corresponding validity state to false and update the error message
          formValid = false
          if (index === 0) {
            setEmailValid(false)
          } else if (index === 1) {
            setFirstNameValid(false)
          } else if (index === 3) {
            setPasswordValid(false)
          }
        }
      })

      if (!formValid) {
        return // Exit the function early if any field is empty so we don't send a query to Cognito
      }

      const signUpResponse = await Auth.signUp({
        username,
        password,
        attributes: {
          given_name,
          family_name,
        },
      })
      console.log("Sign-up response:", signUpResponse)
      // Navigate to another page or handle the sign-up logic
    } catch (error) {
      if (error.code === "UsernameExistsException") {
        alert(
          "An account with the given email already exists. Please use a different email."
        )
      } else {
        alert("Error signing up. Please try again.")
      }
    }
  }

  return (
    <>
      <Head>
        <title>TechNexus - Sign Up</title>
        <meta name="description" content={`Sign up`} />
        <meta property="og:title" content="TechNexus - Sign Up" key="title" />
      </Head>
      <LargeContainerFixed>
        <SignupPageWrapper>
          <Logo>
            <LogoSymbol />
          </Logo>
          <HeaderText>Create your TechNexus account</HeaderText>
          <NameWrapper>
            <AccountText htmlFor="username">Email address</AccountText>
            <InputIconWrapper>
              <EntryContainer
                onChange={onChange}
                name="username"
                id="username"
                type="text"
                placeholder=""
                style={!emailValid ? invalidStyle : {}}
                onBlur={handleEmailBlur}
              />
            </InputIconWrapper>
            {!emailValid && (
              <ValidationMessage>
                Please enter a valid email address.
              </ValidationMessage>
            )}
          </NameWrapper>
          <NameWrapper>
            <AccountText htmlFor="given_name">First Name</AccountText>
            <InputIconWrapper>
              <EntryContainer
                onChange={onChange}
                name="given_name"
                id="given_name"
                type="text"
                placeholder=""
                style={!firstNameValid ? invalidStyle : {}}
                onBlur={handleFirstNameBlur}
              />
            </InputIconWrapper>
            {!firstNameValid && (
              <ValidationMessage>
                Please enter a valid first name.
              </ValidationMessage>
            )}
          </NameWrapper>
          <NameWrapper>
            <AccountText htmlFor="family_name">Last Name</AccountText>
            <InputIconWrapper>
              <EntryContainer
                onChange={onChange}
                name="family_name"
                id="family_name"
                type="text"
                placeholder=""
                style={!lastNameValid ? invalidStyle : {}}
                onBlur={handleLastNameBlur}
              />
            </InputIconWrapper>
            {!lastNameValid && (
              <ValidationMessage>
                Please enter a valid last name.
              </ValidationMessage>
            )}
          </NameWrapper>
          <PasswordWrapper>
            <AccountText htmlFor="password">Password</AccountText>
            <InputIconWrapper>
              <EntryContainer
                onChange={onChange}
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                style={!passwordValid ? invalidStyle : {}}
                onBlur={handlePasswordBlur}
              />
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
              </IconButton>
            </InputIconWrapper>
            {!passwordValid && (
              <ValidationMessage>
                Please enter a valid password.
              </ValidationMessage>
            )}
          </PasswordWrapper>
          <PasswordWrapper>
            <AccountText htmlFor="password">Confirm Password</AccountText>
            <InputIconWrapper>
              <EntryContainer
                onChange={onChange}
                name="confirmPassword"
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder=""
                style={!confirmPasswordValid ? invalidStyle : {}}
                onBlur={handleConfirmPasswordBlur}
              />
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
              </IconButton>
            </InputIconWrapper>
            {!confirmPasswordValid && (
              <ValidationMessage>Passwords do not match.</ValidationMessage>
            )}
          </PasswordWrapper>
          <EntryBtnWrapper>
            <SignInBtn onClick={signUp} type="button">
              Sign Up
            </SignInBtn>
            {/* Next.js Link component for navigation or router.push() */}
            <ResetText onClick={toggleSignUp}>Existing user?</ResetText>
          </EntryBtnWrapper>
        </SignupPageWrapper>
      </LargeContainerFixed>
    </>
  )
}

export default SignUpPage
