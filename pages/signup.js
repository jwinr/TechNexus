import React, { useState, useEffect, useRef } from "react"
import { signUp } from "aws-amplify/auth"
import styled, { keyframes } from "styled-components"
import { useRouter } from "next/router"
import PasswordReveal from "../components/auth/PasswordReveal.js"
import LogoSymbol from "../public/images/logo_n.png"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link.js"
import Checkbox from "../components/common/Checkbox.js"
import AuthContainerWrapper from "../components/auth/AuthContainerWrapper"
import CognitoErrorMessages from "../utils/CognitoErrorMessages.js"

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

const FormContainer = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`

const EntryWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  margin: 15px 0;
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
  padding: 5px 0;
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

const EntryBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
`

const ValidationMessage = styled.div`
  position: absolute;
  color: #d32f2f;
  font-size: 14px;
  bottom: -20px;
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
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const infoButtonRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState("")

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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\-])[A-Za-z\d\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\-]{8,20}$/
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

  const handleSignUp = async (event) => {
    event.preventDefault() // Prevent default form submission behavior

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
      setSignUpResponse(signUpResponse)
      // console.log("Sign-up response:", signUpResponse)
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

  const handleKeepSignedInChange = (e) => {
    setKeepSignedIn(e.target.checked)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const activeElement = document.activeElement
      const isPasswordRevealButton =
        activeElement &&
        activeElement.classList.contains("password-reveal-button")

      if (!isPasswordRevealButton) {
        event.preventDefault() // Prevent default form submission
        handleSignIn(event) // Call the sign-in handler
      }
    }
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
          <Image src={LogoSymbol} alt="TechNexus Logo" priority />
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
            <FormContainer
              onSubmit={handleSignUp}
              noValidate
              data-form-type="register"
              onKeyDown={handleKeyDown}
            >
              <EntryWrapper>
                <EntryContainer
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
                <Label
                  htmlFor="username"
                  style={!emailValid ? invalidStyle : {}}
                >
                  Email address
                </Label>
              </EntryWrapper>
              {!emailValid && (
                <ValidationMessage>
                  Please enter a valid email address.
                </ValidationMessage>
              )}
              <EntryWrapper>
                <EntryContainer
                  onChange={onChange}
                  type="text"
                  id="given_name"
                  name="given_name"
                  placeholder=""
                  required=""
                  aria-required="true"
                  value=""
                  data-form-type="name,first"
                  style={!firstNameValid ? invalidStyle : {}}
                  onBlur={handleFirstNameBlur}
                />
                <Label
                  htmlFor="given_name"
                  style={!firstNameValid ? invalidStyle : {}}
                >
                  First Name
                </Label>
                {!firstNameValid && (
                  <ValidationMessage>
                    Please enter a valid first name.
                  </ValidationMessage>
                )}
              </EntryWrapper>
              <EntryWrapper>
                <EntryContainer
                  onChange={onChange}
                  type="text"
                  id="family_name"
                  name="family_name"
                  placeholder=""
                  required=""
                  aria-required="true"
                  value=""
                  data-form-type="name,last"
                  style={!lastNameValid ? invalidStyle : {}}
                  onBlur={handleLastNameBlur}
                />
                <Label
                  htmlFor="family_name"
                  style={!lastNameValid ? invalidStyle : {}}
                >
                  Last Name
                </Label>
                {!lastNameValid && (
                  <ValidationMessage>
                    Please enter a valid last name.
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
                  autoComplete="new-password"
                  aria-label="Password"
                  data-form-type="password,new"
                  style={!passwordValid ? invalidStyle : {}}
                  onBlur={handlePasswordBlur}
                />
                <Label
                  htmlFor="password"
                  style={!passwordValid ? invalidStyle : {}}
                >
                  Password
                </Label>
                <PasswordReveal
                  onClick={() => setShowPassword(!showPassword)}
                  clicked={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                />
                {!passwordValid && (
                  <ValidationMessage>
                    Please enter a valid password.
                  </ValidationMessage>
                )}
              </EntryWrapper>
              <EntryWrapper>
                <EntryContainer
                  onChange={onChange}
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  autoComplete="new-password"
                  aria-label="Confirm Password"
                  data-form-type="password,confirmation"
                  style={!confirmPasswordValid ? invalidStyle : {}}
                  onBlur={handleConfirmPasswordBlur}
                />
                <Label
                  htmlFor="password"
                  style={!confirmPasswordValid ? invalidStyle : {}}
                >
                  Confirm Password
                </Label>
                <PasswordReveal
                  onClick={() => setShowPassword(!showPassword)}
                  clicked={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                />
                {!confirmPasswordValid && (
                  <ValidationMessage>Passwords do not match.</ValidationMessage>
                )}
              </EntryWrapper>
              <KeepSignInWrapper>
                <Checkbox
                  id={"keepMeSignedIn"}
                  tabIndex
                  label={"Keep me signed in"}
                  checked={keepSignedIn}
                  onChange={handleKeepSignedInChange}
                />
                <TooltipContainer ref={infoButtonRef}>
                  <InfoButton
                    onClick={handleClick}
                    aria-label="Information about keeping signed in"
                  >
                    <span className="info-icon">i</span>
                  </InfoButton>
                  {showTooltip && (
                    <InfoTooltip>
                      By checking this box, you will stay signed in even after
                      closing the browser. Only use this feature on your
                      personal device.
                    </InfoTooltip>
                  )}
                </TooltipContainer>
              </KeepSignInWrapper>
            </FormContainer>
            <PolicyContainer>
              By creating an account, you agree to the following:
              <Link href="/terms">TechNexus terms and conditions</Link>
              <Link href="/privacy">TechNexus privacy policy</Link>
            </PolicyContainer>
            <EntryBtnWrapper>
              <SignInBtn type="submit" data-form-type="action,register">
                Create account
              </SignInBtn>
            </EntryBtnWrapper>
            <ResetText onClick={toggleSignUp}>Existing user?</ResetText>
          </>
        )}
      </AuthContainerWrapper>
    </>
  )
}

export default SignUpPage
