import React, { useState, useRef } from "react"
import { signUp } from "aws-amplify/auth"
import styled from "styled-components"
import { useRouter } from "next/router"
import PasswordReveal from "../components/auth/PasswordReveal.js"
import LogoSymbol from "../public/images/logo_n.png"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link.js"
import Checkbox from "../components/common/Checkbox.js"
import CognitoErrorMessages from "../utils/CognitoErrorMessages.js"
import * as AuthStyles from "../components/auth/AuthStyles"
import {
  validateEmailDomain,
  validatePassword,
  validateFirstName,
  validateLastName,
  handleBlur,
  handleKeyDown,
} from "../utils/AuthHelpers"
import useTooltip from "../components/hooks/useTooltip.js"

const CreateAccBtn = styled(AuthStyles.AuthBtn)`
  margin-top: 15px;
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

const SubheaderText = styled.h1`
  font-weight: 500;
  font-size: 18px;
  padding: 5px;
`

const SignUp = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [given_name, setFirstName] = useState("")
  const [family_name, setLastName] = useState("")
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true)
  const [emailValid, setEmailValid] = useState(true)
  const [firstNameValid, setFirstNameValid] = useState(true)
  const [lastNameValid, setLastNameValid] = useState(true)
  const [signUpResponse, setSignUpResponse] = useState(null)
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const infoButtonRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState("")
  const { invalidStyle } = AuthStyles

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const router = useRouter()

  const handleRedirect = () => {
    router.push("/")
  }

  const handleEmailBlur = () => {
    handleBlur(username, validateEmailDomain, setEmailValid)
  }

  const handleFirstNameBlur = () => {
    handleBlur(given_name, validateFirstName, setFirstNameValid)
  }

  const handleLastNameBlur = () => {
    handleBlur(family_name, validateLastName, setLastNameValid)
  }

  const handlePasswordBlur = () => {
    handleBlur(password, validatePassword, setPasswordValid)
  }

  const handleConfirmPasswordBlur = () => {
    // Validate only if the password field has been touched
    if (confirmPassword.trim().length === 0) {
      if (password !== confirmPassword) {
        setConfirmPasswordValid(false)
        confirmPasswordRef.current.focus()
      } else {
        setConfirmPasswordValid(true)
      }
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
      setConfirmPassword(value)
      setConfirmPasswordValid(true)
    } else if (name === "given_name") {
      setFirstName(value)
      setFirstNameValid(true) // Reset first name validity when first name changes
    } else if (name === "family_name") {
      setLastName(value)
      setLastNameValid(true) // Reset last name validity when last name changes
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()

    const isEmailValid = validateEmailDomain(username)
    const isPasswordValid = validatePassword(password)
    const isFirstNameValid = validateFirstName(given_name)
    const isLastNameValid = validateLastName(family_name)
    const isConfirmPasswordValid = password === confirmPassword

    setEmailValid(isEmailValid)
    setPasswordValid(isPasswordValid)
    setFirstNameValid(isFirstNameValid)
    setLastNameValid(isLastNameValid)
    setConfirmPasswordValid(isConfirmPasswordValid)

    if (!isEmailValid) {
      emailRef.current.focus()
    } else if (!isFirstNameValid) {
      firstNameRef.current.focus()
    } else if (!isLastNameValid) {
      lastNameRef.current.focus()
    } else if (!isPasswordValid) {
      passwordRef.current.focus()
    } else if (!isConfirmPasswordValid) {
      confirmPasswordRef.current.focus()
    }

    if (
      !isEmailValid ||
      !isPasswordValid ||
      !isFirstNameValid ||
      !isLastNameValid ||
      !isConfirmPasswordValid
    ) {
      return
    }

    try {
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
      // console.log("Sign up response:", signUpResponse)
      setSignUpResponse(signUpResponse)
    } catch (error) {
      if (error.name && CognitoErrorMessages[error.name]) {
        setErrorMessage(CognitoErrorMessages[error.name])
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.")
      }
    }
  }

  const handleClick = () => {
    setShowTooltip(!showTooltip)
  }

  const forwardLogin = () => {
    router.push("/login")
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
          content="Get the most out of TechNexus by creating an account."
        />
      </Head>
      <AuthStyles.AuthContainerWrapper>
        <AuthStyles.LogoBox>
          <Image src={LogoSymbol} alt="TechNexus Logo" priority={false} />
        </AuthStyles.LogoBox>
        {/* Conditional rendering based on signUpResponse */}
        {signUpResponse &&
        signUpResponse.nextStep &&
        signUpResponse.nextStep.signUpStep === "CONFIRM_SIGN_UP" ? (
          // Display confirmation message when signUpStep is CONFIRM_SIGN_UP
          <>
            <AuthStyles.HeaderText>
              Your TechNexus acccount has been created.
            </AuthStyles.HeaderText>
            <SubheaderText>You're ready to start shopping!</SubheaderText>
            <CtaShopBtn onClick={handleRedirect} type="button">
              Shop now
            </CtaShopBtn>
          </>
        ) : (
          // Display sign-up form when signUpResponse does not exist or signUpStep is not CONFIRM_SIGN_UP
          <>
            <AuthStyles.HeaderText>
              Create your TechNexus account
            </AuthStyles.HeaderText>
            {errorMessage && (
              <AuthStyles.ErrorMessage>{errorMessage}</AuthStyles.ErrorMessage>
            )}
            <AuthStyles.FormContainer
              onSubmit={handleSignUp}
              noValidate
              data-form-type="register"
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
                {!emailValid && (
                  <AuthStyles.ValidationMessage>
                    Please enter a valid email address.
                  </AuthStyles.ValidationMessage>
                )}
              </AuthStyles.EntryWrapper>
              <AuthStyles.EntryWrapper>
                <AuthStyles.EntryContainer
                  ref={firstNameRef}
                  onChange={onChange}
                  type="text"
                  id="given_name"
                  name="given_name"
                  placeholder=""
                  required
                  autoComplete="off"
                  aria-required="true"
                  value={given_name}
                  data-form-type="name,first"
                  style={!firstNameValid ? invalidStyle : {}}
                  onBlur={handleFirstNameBlur}
                />
                <AuthStyles.Label
                  htmlFor="given_name"
                  style={!firstNameValid ? invalidStyle : {}}
                >
                  First Name
                </AuthStyles.Label>
              </AuthStyles.EntryWrapper>
              {!firstNameValid && (
                <AuthStyles.ValidationMessage>
                  Please enter a valid first name.
                </AuthStyles.ValidationMessage>
              )}
              <AuthStyles.EntryWrapper>
                <AuthStyles.EntryContainer
                  ref={lastNameRef}
                  onChange={onChange}
                  type="text"
                  id="family_name"
                  name="family_name"
                  placeholder=""
                  required
                  autoComplete="off"
                  aria-required="true"
                  value={family_name}
                  data-form-type="name,last"
                  style={!lastNameValid ? invalidStyle : {}}
                  onBlur={handleLastNameBlur}
                />
                <AuthStyles.Label
                  htmlFor="family_name"
                  style={!lastNameValid ? invalidStyle : {}}
                >
                  Last Name
                </AuthStyles.Label>
              </AuthStyles.EntryWrapper>
              {!lastNameValid && (
                <AuthStyles.ValidationMessage>
                  Please enter a valid last name.
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
                  value={password}
                  autoComplete="new-password"
                  aria-label="Password"
                  data-form-type="password,new"
                  style={!passwordValid ? invalidStyle : {}}
                  onBlur={handlePasswordBlur}
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
                />
              </AuthStyles.EntryWrapper>
              {!passwordValid && (
                <AuthStyles.ValidationMessage>
                  Please enter a valid password.
                </AuthStyles.ValidationMessage>
              )}
              <AuthStyles.EntryWrapper>
                <AuthStyles.EntryContainer
                  ref={confirmPasswordRef}
                  onChange={onChange}
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=""
                  value={confirmPassword}
                  autoComplete="new-password"
                  aria-label="Confirm Password"
                  data-form-type="password,confirmation"
                  style={!confirmPasswordValid ? invalidStyle : {}}
                  onBlur={handleConfirmPasswordBlur}
                />
                <AuthStyles.Label
                  htmlFor="confirmPassword"
                  style={!confirmPasswordValid ? invalidStyle : {}}
                >
                  Confirm Password
                </AuthStyles.Label>
                <PasswordReveal
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  clicked={showConfirmPassword}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                />
              </AuthStyles.EntryWrapper>
              {!confirmPasswordValid && (
                <AuthStyles.ValidationMessage>
                  Passwords do not match.
                </AuthStyles.ValidationMessage>
              )}
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
                      closing the browser. Only use this feature on your
                      personal device.
                    </AuthStyles.InfoTooltip>
                  )}
                </AuthStyles.TooltipContainer>
              </AuthStyles.KeepSignInWrapper>
              <AuthStyles.PolicyContainer>
                By creating an account, you agree to the following:
                <Link href="/terms">TechNexus terms and conditions</Link>
                <Link href="/privacy">TechNexus privacy policy</Link>
              </AuthStyles.PolicyContainer>
              <AuthStyles.EntryBtnWrapper>
                <CreateAccBtn type="submit" data-form-type="action,register">
                  Create account
                </CreateAccBtn>
              </AuthStyles.EntryBtnWrapper>
            </AuthStyles.FormContainer>
            <AuthStyles.ResetText onClick={forwardLogin}>
              Existing user?
            </AuthStyles.ResetText>
          </>
        )}
      </AuthStyles.AuthContainerWrapper>
    </>
  )
}

export default SignUp
