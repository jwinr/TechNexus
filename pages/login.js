import React, { useState, useEffect, useRef, useContext } from "react"
import Head from "next/head"
import { signIn, confirmSignUp, signOut, resetPassword } from "aws-amplify/auth"
import { fetchAuthSession } from "aws-amplify/auth"
import { useRouter } from "next/router"
import styled, { keyframes } from "styled-components"
import Checkbox from "../components/common/Checkbox"
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import SignUpPage from "./signup"
import ForgotPassword from "./forgot-password.js"
import LogoSymbol from "../public/logo_n.png"
import Image from "next/image"
import Link from "next/link.js"
import AuthContainerWrapper from "../components/auth/AuthContainerWrapper"
import { UserContext } from "../context/UserContext"

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
  UserAlreadyAuthenticatedException: "There is already a signed in user.",
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

const EntryWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  margin: 10px 0;
`

const EntryContainer = styled.input`
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 0.25rem;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: var(--sc-color-text);
  padding-right: 40px;
  transition: border-color 0.3s;

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0px;
    left: 10px;
    font-size: 12px;
    color: var(--sc-color-text);
  }
`

const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--sc-color-text);
  background-color: var(--sc-color-white);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
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
  margin: 5px;
  padding: 5px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus .info-icon,
  &:hover .info-icon {
    color: var(--sc-color-white);
    background-color: var(--sc-color-blue);
    transition: all 0.3s;
  }

  .info-icon {
    appearance: none;
    background-color: transparent;
    border: 2px solid var(--sc-color-blue);
    border-radius: 50%;
    width: 17px;
    height: 17px;
    color: var(--sc-color-blue);
    background-color: var(--sc-color-white);
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
  }
`

const InfoTooltip = styled.div`
  position: absolute;
  transform: translateX(45%);
  left: 50%;
  background-color: var(--sc-color-white);
  color: var(--sc-color-text);
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: normal;
  max-width: 250px;
  min-width: 0;
  text-align: left;
  box-shadow: rgba(156, 156, 156, 0.7) 0px 0px 6px;
  animation: ${fadeIn} 0.3s ease;
  border: 1px solid transparent;

  &:after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid transparent;
    background-color: var(--sc-color-white);
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

  @media (max-width: 768px) {
    left: 0;
  }
`

const ResetText = styled.button`
  display: inline-block;
  margin-top: 5px;
  padding: 5px;
  align-content: baseline;
  font-weight: 500;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    text-decoration: underline;
  }
`

const SignInBtn = styled.button`
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--sc-color-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
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

const IconButton = styled.button`
  position: absolute;
  right: 10px;
  padding: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
`

const IconContainer = styled.div`
  position: relative;
  width: 24px;
  height: 24px;

  & > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .show {
    opacity: 1;
    transform: translateY(0);
  }

  .hide {
    opacity: 0;
    transform: translateY(-7px);
  }
`

const EntryBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
  width: 100%;
`

const ValidationMessage = styled.div`
  position: absolute;
  color: #d32f2f;
  font-size: 14px;
  bottom: -20px;
`

const PolicyContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 12px;
  color: var(--sc-color-text-light-gray);
  margin: 10px 0px 0px;
  align-items: center;

  a {
    color: var(--sc-color-link-blue);
    width: fit-content;
  }

  a:hover {
    text-decoration: underline;
  }

  a:focus-visible {
    text-decoration: underline;
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
  const [authChecked, setAuthChecked] = useState(false)
  const { fetchUserAttributes } = useContext(UserContext)

  // Check if there's already an active sign-in
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const session = await fetchAuthSession()
        if (session && session.tokens && session.tokens.idToken) {
          await fetchUserAttributes()
          router.push("/")
        }
      } catch (error) {
        console.log("No authenticated user found", error)
      } finally {
        setAuthChecked(true) // We only want to run the check once
      }
    }

    if (!authChecked) {
      checkUserAuthentication()
    }
  }, [authChecked, router, fetchUserAttributes])

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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-])[a-zA-Z\d\^$*.$begin:math:display$$end:math:display${}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]{8,20}$/
    return pattern.test(password)
  }

  // Apply red border/text if information is invalid
  const invalidStyle = { borderColor: "#D32F2F", color: "#D32F2F" }

  /* Mock reset function for development environment
  const resetMock = async ({ username, password }) => {
    // Simulate a response that always triggers the RESET_PASSWORD step
    return {
      isSignedIn: false,
      nextStep: { signInStep: "RESET_PASSWORD" },
    }
  }
  */

  // Confirm the user automatically since we don't want to force that step
  const confirmUser = async (username) => {
    try {
      await confirmSignUp(username)
    } catch (error) {
      console.error("Error confirming user automatically:", error)
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

      // Call signIn with username and password
      const response = await signIn({ username, password })

      if (response.nextStep) {
        switch (response.nextStep.signInStep) {
          case "CONFIRM_SIGN_UP": // We're bypassing the required email verifications
            try {
              const res = await fetch("/api/confirm-user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
              })

              if (res.ok) {
                const newResponse = await signIn({ username, password })
                if (newResponse.isSignedIn) {
                  await fetchUserAttributes()
                  router.push("/")
                } else {
                  setErrorMessage(
                    "An unexpected error occurred. Please try again later."
                  )
                }
              } else {
                setErrorMessage("Error confirming user automatically")
              }
            } catch (error) {
              console.error("Error confirming user automatically:", error)
              setErrorMessage("Error confirming user automatically")
            }
            break
          case "RESET_PASSWORD":
            setShowResetPassword(true)
            setResetPasswordStep(true)
            setErrorMessage("")
            break
          case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
            setShowResetPassword(true)
            setResetPasswordStep(true)
            setErrorMessage("")
            break
          case "DONE":
            await fetchUserAttributes()
            router.push("/")
            break
          default:
            setErrorMessage(
              "An unexpected step is required. Please contact support."
            )
            break
        }
      } else if (response.isSignedIn) {
        await fetchUserAttributes()
        router.push("/")
      } else {
        setErrorMessage("Sign-in failed. Please try again.")
      }
    } catch (error) {
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
            <meta
              name="description"
              content="Get the most out of TechNexus by signing in to your account."
            />
          </Head>
          <AuthContainerWrapper>
            <LogoBox>
              <Image src={LogoSymbol} alt="TechNexus Logo" priority={true} />
            </LogoBox>
            <HeaderText>Sign in to TechNexus</HeaderText>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <EntryWrapper>
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
              <Label htmlFor="username" style={!emailValid ? invalidStyle : {}}>
                Email address
              </Label>
              {!emailValid && (
                <ValidationMessage>
                  Please enter a valid email address.
                </ValidationMessage>
              )}
            </EntryWrapper>
            <EntryWrapper>
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
              <Label
                htmlFor="password"
                style={!passwordValid ? invalidStyle : {}}
              >
                Password
              </Label>
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <IconContainer>
                  <LiaEyeSolid className={showPassword ? "hide" : "show"} />
                  <LiaEyeSlashSolid
                    className={showPassword ? "show" : "hide"}
                  />
                </IconContainer>
              </IconButton>
              {!passwordValid && (
                <ValidationMessage>
                  Please enter a valid password.
                </ValidationMessage>
              )}
            </EntryWrapper>
            <ResetText onClick={handlePasswordReset}>
              Forgot Password?
            </ResetText>
            <KeepSignInWrapper>
              <Checkbox
                id={"id"}
                tabIndex
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
                Sign in
              </SignInBtn>
            </EntryBtnWrapper>
            <EntryBtnWrapper>
              <SignInBtn onClick={toggleSignUp} type="button">
                Create account
              </SignInBtn>
            </EntryBtnWrapper>
            <PolicyContainer>
              By signing in, you agree to the following:
              <Link href="/terms">TechNexus terms and conditions</Link>
              <Link href="/privacy">TechNexus privacy policy</Link>
            </PolicyContainer>
          </AuthContainerWrapper>
        </>
      )}
    </>
  )
}

export default Login
