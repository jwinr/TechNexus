import React, { useState, useEffect } from "react"
import { signUp } from "aws-amplify/auth"
import * as Styled from "../components/auth/SignStyles"
import styled from "styled-components"
import { useRouter } from "next/router"
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import LogoSymbol from "../public/logo_n.png"
import Image from "next/image"
import Head from "next/head"
import AuthContainerWrapper from "../components/auth/AuthContainerWrapper"

// Custom error messages based on Cognito error codes
const cognitoErrorMessages = {
  UsernameExistsException:
    "An account with the given email already exists. Please use a different email.",
  LimitExceededException:
    "You have exceeded the allowed number of registration attempts. Please try again later.",
}

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 23px;
  padding: 5px;
  text-align: center;
`

const SubheaderText = styled.h1`
  font-weight: 500;
  font-size: 18px;
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
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 0.25rem;
  width: 350px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: var(--sc-color-text);
  outline: none;
  padding-right: 40px;
`

const ErrorMessage = styled.div`
  display: flex;
  color: #d32f2f;
  font-size: 14px;
  padding: 10px 0;
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
  border-radius: 6px;
  padding: 8px 20px;
  color: var(--sc-color-white);
  border: medium;
  width: 350px;
  text-align: center;
  background-color: var(--sc-color-blue);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-main-dark-blue);
  }

  &:active {
    background-color: var(--color-main-dark-blue);
  }

  &:focus-visible {
    background-color: var(--color-main-dark-blue);
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
    cursor: pointer;
  }
`

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  width: 140px;

  @media (max-width: 768px) {
    max-width: 75px;
    width: auto;
  }
`

const CtaShopBtn = styled.button`
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: var(--sc-color-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 8px 20px;
  width: 250px;
  text-align: center;
  background-color: var(--sc-color-blue);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:active {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
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
  const [signUpResponse, setSignUpResponse] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    given_name: "",
    family_name: "",
    password: "",
  })

  const router = useRouter()

  const handleRedirect = () => {
    router.push("/")
  }

  const validateEmailDomain = (email) => {
    // Simplified regex to catch some invalid formats
    const regex = /.+@\S+\.\S+$/
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
    // console.log(`Updating state for ${name} with value:`, value) // Log the value being set
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-])[a-zA-Z\d\^$*.$begin:math:display$$end:math:display${}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]{8,20}$/
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
  const invalidStyle = { borderColor: "#D32F2F", color: "#D32F2F" }

  const handleSignUp = async () => {
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

      // Validate the email before making the API call
      const isEmailValid = validateEmailDomain(username)
      if (!isEmailValid) {
        setEmailValid(false)
        return
      }

      // Validate the password before making the API call
      const isPasswordValid = validatePassword(password)
      if (!isPasswordValid) {
        setPasswordValid(false)
        return
      }

      const signUpResponse = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            given_name,
            family_name,
          },
        },
      })
      setSignUpResponse(signUpResponse)
      console.log("Sign-up response:", signUpResponse)
      // Navigate to another page or handle the sign-up logic
    } catch (error) {
      if (error.name && cognitoErrorMessages[error.name]) {
        setErrorMessage(cognitoErrorMessages[error.name])
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.")
      }
    }
  }

  return (
    <>
      <Head>
        <title>Login: TechNexus</title>
        <meta property="og:title" content="Login: TechNexus" key="title" />
        <meta
          name="description"
          content="Get the most out of TechNexus by creating an account."
        />
      </Head>
      <AuthContainerWrapper>
        <LogoBox>
          <Image src={LogoSymbol} alt="TechNexus Logo" priority={true} />
        </LogoBox>
        {/* Conditional rendering based on signUpResponse */}
        {signUpResponse &&
        signUpResponse.nextStep &&
        signUpResponse.nextStep.signUpStep === "CONFIRM_SIGN_UP" ? (
          // Display confirmation message when signUpStep is CONFIRM_SIGN_UP
          <>
            <HeaderText>Your TechNexus acccount has been created.</HeaderText>
            <SubheaderText>You're ready to start shopping!</SubheaderText>
            <CtaShopBtn onClick={handleRedirect} type="button">
              Shop now
            </CtaShopBtn>
          </>
        ) : (
          // Display sign-up form when signUpResponse does not exist or signUpStep is not CONFIRM_SIGN_UP
          <>
            <HeaderText>Create your TechNexus account</HeaderText>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
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
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
                </IconButton>
              </InputIconWrapper>
              {!confirmPasswordValid && (
                <ValidationMessage>Passwords do not match.</ValidationMessage>
              )}
            </PasswordWrapper>
            <EntryBtnWrapper>
              <SignInBtn onClick={handleSignUp} type="button">
                Sign Up
              </SignInBtn>
              {/* Next.js Link component for navigation or router.push() */}
              <ResetText onClick={toggleSignUp}>Existing user?</ResetText>
            </EntryBtnWrapper>
          </>
        )}
      </AuthContainerWrapper>
    </>
  )
}

export default SignUpPage
