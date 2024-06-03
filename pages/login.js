import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import { signIn, signOut, resetPassword } from "aws-amplify/auth"
import { useRouter } from "next/router"
import styled, { keyframes } from "styled-components"
import Checkbox from "../components/common/Checkbox"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import SignUpPage from "./signup"
import ForgotPassword from "./forgot-password.js"
import LogoSymbol from "../public/logo_n.svg"
import { config } from "../utils/config.js"
import AuthContainerWrapper from "../components/auth/AuthContainerWrapper"

// Custom error messages based on Cognito error codes
const cognitoErrorMessages = {
  UserNotFoundException:
    "User does not exist. Please check your email address.",
  NotAuthorizedException: "Incorrect email address or password.",
  UserNotConfirmedException: "User has not been confirmed yet.",
  CodeMismatchException: "Invalid verification code. Please try again.",
  ExpiredCodeException:
    "The verification code has expired. Please request a new one.",
  LimitExceededException:
    "You have exceeded the allowed number of login attempts. Please try again later.",
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(40%);
  }
  to {
    opacity: 1;
    transform: translateX(45%);
  }
`

const NameWrapper = styled.div`
  margin-bottom: 10px;
`

const PasswordWrapper = styled.div`
  margin-bottom: 10px;
`

const EntryContainer = styled.input`
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
`

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 23px;
  padding: 5px;
`

const InfoButton = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  padding-left: 10px;
  margin: 0;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .info-icon {
    appearance: none;
    background-color: transparent;
    border: 2px solid #00599c;
    border-radius: 50%;
    width: 17px;
    height: 17px;
    color: #00599c;
    background-color: #fff;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const InfoTooltip = styled.div`
  position: absolute;
  transform: translateX(45%);
  left: 50%;
  background-color: white;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: normal;
  max-width: 250px;
  min-width: 0;
  text-align: left;
  box-shadow: rgba(156, 156, 156, 0.7) 0px 0px 6px;
  animation: ${fadeIn} 0.2s ease;
  border: 1px solid transparent;

  &:after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid transparent;
    background-color: #fff;
    z-index: -2;
    left: -6px;
    top: 50%;
    margin-top: -6px;
    transform: rotate(135deg);
    filter: drop-shadow(rgba(0, 0, 0, 0.2) 2px 0px 1px);
  }

  &:before {
    content: "";
    display: block;
    background-color: inherit;
    position: absolute;
    z-index: -1;
    width: 10px;
    height: 18px;
    left: 0;
    top: 50%;
    margin-top: -9px;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
`

const Divider = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 10px 0;
`

const AccountText = styled.label`
  display: block;
  font-size: 13px;
  color: #000;
  font-weight: 400;
  margin-bottom: 0.1rem;
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

const SignInBtn = styled.button`
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in 0s;
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

const KeepSignInWrapper = styled.div`
  display: flex;
  padding-top: 5px;
`

const TooltipContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
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
  color: #d32f2f;
  font-size: 14px;
`

const PolicyContainer = styled.div`
  display: grid;
  text-align: center;
  font-size: 12px;
  color: #595959;
  margin: 10px 0px 0px;
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
    .Tech_Nexus {
      margin: 3px;
      grid-area: nav-logo;
    }
  }
`

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showResetPassword, setShowResetPassword] = useState(false)
  const router = useRouter()
  const [token, setToken] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const infoButtonRef = useRef(null)
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)
  const [resetPasswordStep, setResetPasswordStep] = useState(false)

  const handleClick = () => {
    setShowTooltip(!showTooltip)
  }

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp)
  }

  const togglePasswordReset = () => {
    setShowResetPassword(!showResetPassword)
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    if (storedToken && keepSignedIn) {
      setToken(storedToken)
      // Automatically sign in the user using the stored token
      signInWithToken(storedToken)
    }
  }, [])

  const validateEmailDomain = (email) => {
    // Simplified regex to catch some invalid formats
    const regex = /.+@\S+\.\S+$/
    return regex.test(email)
  }

  const handlePasswordReset = () => {
    setShowResetPassword(true)
    setEmailValid(validateEmailDomain(username))
  }

  const handleEmailBlur = () => {
    if (username.trim().length === 0) {
      // Reset email validity only if the field is empty when blurred
      setEmailValid(true)
    } else {
      setEmailValid(validateEmailDomain(username))
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === "username") {
      setUsername(value)
      // Reset the email validity state to true when user starts editing
      setEmailValid(true)
    } else if (name === "password") {
      setPassword(value)
      // Reset the password validity state as soon as the user starts editing the password
      setPasswordValid(true)
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-])[a-zA-Z0-9\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]{8,20}$/
    return pattern.test(password)
  }

  // Apply red border/text if information is invalid
  const invalidStyle = { borderColor: "#D32F2F", color: "#D32F2F" }

  // Mock signIn function for development environment
  const signInMock = async ({ username, password }) => {
    // Simulate successful sign-in
    return {
      accessToken: {
        jwtToken: "dummyToken",
        expiresIn: 3600,
      },
    }
  }

  // Mock reset function for development environment
  const resetMock = async ({ username, password }) => {
    // Simulate a response that always triggers the RESET_PASSWORD step
    return {
      isSignedIn: false,
      nextStep: { signInStep: "RESET_PASSWORD" },
    }
  }

  const handleSignIn = async () => {
    try {
      let formValid = true // Flag to track overall form validity

      // Loop through the input fields
      ;[username, password].forEach((field, index) => {
        if (field.trim() === "") {
          // If the field is empty, set the corresponding validity state to false and update the error message
          formValid = false
          if (index === 0) {
            setEmailValid(false)
          } else {
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

      // Call signIn with username and password (temporarily using the mock function)
      // const isSignedIn = await signIn({ username, password })

      const isSignedIn = await resetMock({ username, password })

      console.log("Sign-in response:", isSignedIn)

      if (isSignedIn.isSignedIn) {
        // Handle successful sign-in
        const { accessToken } = isSignedIn
        const { jwtToken, expiresIn } = accessToken
        setToken(jwtToken)

        // Set token as a secure HttpOnly cookie
        Cookies.set("authToken", jwtToken, { secure: true, httpOnly: true })

        // Decode the JWT token to extract the expiration time
        const decodedToken = jwtDecode(jwtToken)
        const expirationTime = decodedToken.exp // This will be a UNIX timestamp

        // Set a timeout to automatically sign the user out when the token expires
        const now = Date.now() / 1000 // Convert milliseconds to seconds
        const timeUntilExpiration = expirationTime - now
        setTimeout(() => {
          signOut()
        }, timeUntilExpiration * 1000) // Convert seconds back to milliseconds

        // Navigate to another page
        router.push("/")
      } else if (isSignedIn.nextStep) {
        // Handle different next steps
        switch (isSignedIn.nextStep.signInStep) {
          case "RESET_PASSWORD":
            setShowResetPassword(true)
            setResetPasswordStep(true)
            setErrorMessage("")
            break
          default:
            setErrorMessage(
              "An unexpected step is required. Please contact support."
            )
            break
        }
      }
    } catch (error) {
      // Extract the error name and compare it against the predefined error message array
      if (error.name && cognitoErrorMessages[error.name]) {
        setErrorMessage(cognitoErrorMessages[error.name])
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.")
      }
    }
  }

  const handleKeepSignedInChange = (e) => {
    setKeepSignedIn(e.target.checked)
  }

  useEffect(() => {
    // Handler to call when clicking outside of the tooltip container or scrolling
    const handleActionOutside = (event) => {
      if (
        infoButtonRef.current &&
        !infoButtonRef.current.contains(event.target)
      ) {
        setShowTooltip(false)
      }
    }

    // Add event listener when the component mounts
    document.addEventListener("click", handleActionOutside, true)
    window.addEventListener("scroll", handleActionOutside, true)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleActionOutside, true)
      window.removeEventListener("scroll", handleActionOutside, true)
    }
  }, []) // Using an empty dependency array to run once on mount and cleanup on unmount

  return (
    <>
      {showSignUp ? ( // Conditionally render the sign-up form
        <SignUpPage toggleSignUp={toggleSignUp} /> // Pass toggleSignUp function as prop
      ) : showResetPassword ? ( // Conditionally render the reset password form
        <ForgotPassword
          username={username}
          isEmailValid={validateEmailDomain(username)}
          resetPasswordStep={resetPasswordStep}
          togglePasswordReset={togglePasswordReset}
        />
      ) : (
        <>
          <Head>
            <title>Login: TechNexus</title>
            <meta property="og:title" content="Login: TechNexus" key="title" />
          </Head>
          <AuthContainerWrapper>
            <Logo>
              <LogoSymbol />
            </Logo>
            <HeaderText>Sign in to TechNexus</HeaderText>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <NameWrapper>
              <AccountText htmlFor="username">Email address</AccountText>
              <InputIconWrapper>
                <EntryContainer
                  onChange={onChange}
                  name="username"
                  id="username"
                  type="username"
                  placeholder=""
                  autoComplete="username"
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
            <PasswordWrapper>
              <AccountText htmlFor="password">Password</AccountText>
              <InputIconWrapper>
                <EntryContainer
                  onChange={onChange}
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  autoComplete="current-password"
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
            <ResetText onClick={handlePasswordReset}>
              Forgot Password?
            </ResetText>
            <KeepSignInWrapper>
              <Checkbox
                id={"id"}
                label={"Keep me signed in"}
                checked={keepSignedIn}
                onChange={handleKeepSignedInChange}
              />
              <TooltipContainer ref={infoButtonRef}>
                <InfoButton onClick={handleClick}>
                  <span className="info-icon">i</span>
                </InfoButton>
                {showTooltip && (
                  <InfoTooltip>
                    By checking this box, you will stay signed in even after
                    closing the browser. Only use this feature on your personal
                    device.
                  </InfoTooltip>
                )}
              </TooltipContainer>
            </KeepSignInWrapper>
            <EntryBtnWrapper>
              <SignInBtn onClick={handleSignIn} type="button">
                Sign In
              </SignInBtn>
            </EntryBtnWrapper>
            <EntryBtnWrapper>
              <SignInBtn onClick={toggleSignUp} type="button">
                Create account
              </SignInBtn>
            </EntryBtnWrapper>
            <PolicyContainer>
              By signing in, you agree to the following:
              <a href="/terms">TechNexus terms and conditions</a>
              <a href="/privacy">TechNexus privacy policy</a>
            </PolicyContainer>
          </AuthContainerWrapper>
        </>
      )}
    </>
  )
}

export default Login
