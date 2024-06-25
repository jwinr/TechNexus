import React, { useState, useEffect, useRef, useContext } from "react"
import Head from "next/head"
import { signIn, confirmSignUp } from "aws-amplify/auth"
import { fetchAuthSession } from "aws-amplify/auth"
import { useRouter } from "next/router"
import styled from "styled-components"
import Checkbox from "../components/common/Checkbox"
import PasswordReveal from "../components/auth/PasswordReveal.js"
import LogoSymbol from "../public/images/logo_n.png"
import Image from "next/image"
import Link from "next/link.js"
import { UserContext } from "../context/UserContext"
import CognitoErrorMessages from "../utils/CognitoErrorMessages"
import * as AuthStyles from "../components/auth/AuthStyles"
import {
  validateEmailDomain,
  validatePassword,
  handleBlur,
  handleKeyDown,
} from "../utils/AuthHelpers"
import useTooltip from "../components/hooks/useTooltip.js"

const CreateAccBtn = styled.button`
  align-items: center;
  justify-content: center;
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 6px;
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  text-align: center;
  background-color: var(--sc-color-white);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--sc-color-white-highlight);
  }

  &:active {
    background-color: var(--sc-color-white-highlight);
  }

  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
  }
`

const Divider = styled.div`
  border-bottom: 1px solid var(--sc-color-divider);
  width: 100%;
  margin: 15px 0;
`

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const [token, setToken] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const infoButtonRef = useRef(null)
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const { fetchUserAttributes } = useContext(UserContext)
  const { invalidStyle } = AuthStyles

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

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

  const forwardSignUp = () => {
    router.push("/signup")
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    if (storedToken && keepSignedIn) {
      setToken(storedToken)
      // Automatically sign in the user using the stored token
      signInWithToken(storedToken)
    }
  }, [])

  const handlePasswordReset = (e) => {
    e.preventDefault() // Prevent any default form behavior

    const isValidEmail = validateEmailDomain(username)

    if (isValidEmail) {
      router.push({
        pathname: "/forgot-password",
        query: { username },
      })
    } else {
      // If the email isn't valid, just pass the user to the next page
      router.push("/forgot-password")
    }
  }

  const handleEmailBlur = () => {
    handleBlur(username, validateEmailDomain, setEmailValid)
  }

  const handlePasswordBlur = () => {
    handleBlur(password, validatePassword, setPasswordValid)
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

  // Confirm the user automatically since we don't want to force that step
  const confirmUser = async (username) => {
    try {
      await confirmSignUp(username)
    } catch (error) {
      console.error("Error confirming user automatically:", error)
    }
  }

  const handleSignIn = async (event) => {
    event.preventDefault() // Prevent default form submission behavior

    // Validate the email before making the API call
    const isEmailValid = validateEmailDomain(username)
    setEmailValid(isEmailValid)
    if (!isEmailValid) {
      emailRef.current.focus()
      return
    }

    // Validate the password before making the API call
    const isPasswordValid = validatePassword(password)
    setPasswordValid(isPasswordValid)
    if (!isPasswordValid) {
      passwordRef.current.focus()
      return
    }

    // Call signIn with username and password
    try {
      const response = await signIn({ username, password })

      if (response.nextStep) {
        switch (response.nextStep.signInStep) {
          case "CONFIRM_SIGN_UP": // We're bypassing the required email verifications
            try {
              const res = await fetch("/api/confirm-user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
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
            setErrorMessage("")
            break
          case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
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
      if (error.name && CognitoErrorMessages[error.name]) {
        setErrorMessage(CognitoErrorMessages[error.name])
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.")
      }
    }
  }

  const handleKeepSignedInChange = (e) => {
    setKeepSignedIn(e.target.checked)
  }

  useTooltip(infoButtonRef, setShowTooltip)

  return (
    <>
      <Head>
        <title>Login: TechNexus</title>
        <meta property="og:title" content="Login: TechNexus" key="title" />
        <meta
          name="description"
          content="Get the most out of TechNexus by signing in to your account."
        />
      </Head>
      <AuthStyles.AuthContainerWrapper>
        <AuthStyles.LogoBox>
          <Image src={LogoSymbol} alt="TechNexus Logo" priority={false} />
        </AuthStyles.LogoBox>
        <AuthStyles.HeaderText>Sign in to TechNexus</AuthStyles.HeaderText>
        {errorMessage && (
          <AuthStyles.ErrorMessage>{errorMessage}</AuthStyles.ErrorMessage>
        )}
        <AuthStyles.FormContainer
          onSubmit={handleSignIn}
          noValidate
          data-form-type="login"
          onKeyDown={handleKeyDown}
        >
          <AuthStyles.EntryWrapper>
            <AuthStyles.EntryContainer
              ref={emailRef}
              onChange={onChange}
              name="username"
              id="username"
              required
              type="email"
              placeholder=""
              autoComplete="off"
              aria-label="Email address"
              style={!emailValid ? invalidStyle : {}}
              onBlur={handleEmailBlur}
              value={username}
            />
            <AuthStyles.Label
              htmlFor="username"
              style={!emailValid ? invalidStyle : {}}
            >
              Email address
            </AuthStyles.Label>
          </AuthStyles.EntryWrapper>
          {!emailValid && (
            <AuthStyles.ValidationMessage>
              Please enter a valid email address.
            </AuthStyles.ValidationMessage>
          )}
          <AuthStyles.EntryWrapper>
            <AuthStyles.EntryContainer
              ref={passwordRef}
              onChange={onChange}
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              autoComplete="current-password"
              aria-label="Password"
              data-form-type="password"
              style={!passwordValid ? invalidStyle : {}}
              onBlur={handlePasswordBlur}
              value={password}
            />
            <AuthStyles.Label
              htmlFor="password"
              style={!passwordValid ? invalidStyle : {}}
            >
              Password
            </AuthStyles.Label>
            <PasswordReveal
              onClick={() => setShowPassword(!showPassword)}
              clicked={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              role="button"
              className="password-reveal-button"
            />
          </AuthStyles.EntryWrapper>
          {!passwordValid && (
            <AuthStyles.ValidationMessage>
              Please enter a valid password.
            </AuthStyles.ValidationMessage>
          )}
          <AuthStyles.ResetText onClick={handlePasswordReset}>
            Forgot Password?
          </AuthStyles.ResetText>
          <AuthStyles.KeepSignInWrapper>
            <Checkbox
              id={"keepMeSignedIn"}
              tabIndex
              label={"Keep me signed in"}
              checked={keepSignedIn}
              onChange={handleKeepSignedInChange}
            />
            <AuthStyles.TooltipContainer ref={infoButtonRef}>
              <AuthStyles.InfoButton
                onClick={handleClick}
                aria-label="Information about keeping signed in"
              >
                <span className="info-icon">i</span>
              </AuthStyles.InfoButton>
              {showTooltip && (
                <AuthStyles.InfoTooltip>
                  By checking this box, you will stay signed in even after
                  closing the browser. Only use this feature on your personal
                  device.
                </AuthStyles.InfoTooltip>
              )}
            </AuthStyles.TooltipContainer>
          </AuthStyles.KeepSignInWrapper>
          <AuthStyles.EntryBtnWrapper>
            <AuthStyles.AuthBtn type="submit" data-form-type="action,login">
              Sign in
            </AuthStyles.AuthBtn>
          </AuthStyles.EntryBtnWrapper>
          <Divider />
          <AuthStyles.EntryBtnWrapper>
            <CreateAccBtn onClick={forwardSignUp} type="button">
              Create account
            </CreateAccBtn>
          </AuthStyles.EntryBtnWrapper>
        </AuthStyles.FormContainer>
        <AuthStyles.PolicyContainer>
          By signing in, you agree to the following:
          <Link href="/terms">TechNexus terms and conditions</Link>
          <Link href="/privacy">TechNexus privacy policy</Link>
        </AuthStyles.PolicyContainer>
      </AuthStyles.AuthContainerWrapper>
    </>
  )
}

export default Login
