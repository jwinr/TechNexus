import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import styled from "styled-components"
import { resetPassword, confirmResetPassword } from "aws-amplify/auth"
import { useRouter } from "next/router"
import LogoSymbol from "../public/images/logo_n.png"
import Image from "next/image"
import PasswordReveal from "../components/auth/PasswordReveal.js"
import { IoCheckmarkCircleSharp } from "react-icons/io5"
import LoaderDots from "../components/loaders/LoaderDots"
import CognitoErrorMessages from "../utils/CognitoErrorMessages"
import ErrorRedirect from "../components/auth/ErrorRedirect"
import * as AuthStyles from "../components/auth/AuthStyles"
import {
  validateEmailDomain,
  validatePassword,
  handleBlur,
} from "../utils/AuthHelpers"

const ContinueBtn = styled(AuthStyles.AuthBtn)`
  margin-top: 15px;
`

const SuccessMessage = styled.div`
  font-size: 16px;
  text-align: center;
`

const SubheaderText = styled.div`
  font-size: 19px;
  margin-bottom: 15px;
  text-align: center;
`

const VerificationInput = styled.input`
  border-width: 0px 0px 4px;
  border-bottom-style: solid;
  border-bottom-color: var(--sc-color-button-disabled);
  border-radius: 0px;
  text-align: center;
  width: 90%;
  outline: none;
  height: 49px;
  font-size: ${(props) => (props.hasValue ? "29px" : "19px")};
  padding-bottom: 12px;
  background-color: transparent;
  text-indent: ${(props) => (props.hasValue ? "20px" : "0")};
  letter-spacing: ${(props) => (props.hasValue ? "20px" : "normal")};
  font-weight: ${(props) => (props.hasValue ? "700" : "normal")};
  caret-color: ${(props) => (props.hasValue ? "inherit" : "#666666")};

  // Disabling non-numeric keys using JavaScript
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
  appearance: textfield;

  &::placeholder {
    color: ${(props) => (props.hasValue ? "inherit" : "#666666")};
  }
`

const VerifyBtn = styled.button`
  font-weight: bold;
  border-radius: 6px;
  color: ${(props) =>
    props.disabled
      ? "var(--sc-color-button-text-disabled)"
      : "var(--sc-color-white)"};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  background-color: ${(props) =>
    props.disabled
      ? "var(--sc-color-button-disabled)"
      : "var(--sc-color-blue)"};
  transition: background-color 0.3s;
  margin-top: 24px;

  &:disabled {
    cursor: not-allowed;
    color: var(--sc-color-button-text-disabled) !important;
    background-color: var(--sc-color-button-disabled) !important;
  }

  &:not(:disabled):hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:not(:disabled):active {
    background-color: var(--sc-color-dark-blue);
  }

  &:not(:disabled):focus-visible {
    background-color: var(--sc-color-dark-blue);
  }
`

const RequirementTitle = styled.div`
  padding-top: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  align-self: flex-start;
`

const RequirementList = styled.ul`
  text-align: left;
  font-size: 12px;
  font-weight: 400;
  color: var(--sc-color-button-text-disabled);
  padding-left: 20px;
  margin: 8px 0px 0px;
  align-self: flex-start;
`

const RequirementListItem = styled.li`
  margin-bottom: 4px;
  color: var(--sc-color-green);
  list-style: none;
  margin-left: -12px;

  color: ${(props) => (props.met ? "var(--sc-color-green)" : "#d32f2f")};

  &:before {
    content: ${(props) => (props.met ? "'✓'" : "''")};
    padding-right: ${(props) => (props.met ? "4px" : "0px")};
    font-weight: bold;
    margin-left: ${(props) => (props.met ? "-12px" : "0px")};
  }
`

const RequirementListItemDone = styled.div`
  position: relative;
  color: var(--sc-color-green);
  font-size: 12px;

  svg {
    display: inline-block;
    margin-right: 6px;
  }
`

const ForgotPassword = () => {
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showError, setShowError] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [username, setUsername] = useState("")
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState("initial")
  const [loading, setLoading] = useState(true)
  const [lengthMet, setLengthMet] = useState(false)
  const [lowerCaseMet, setLowerCaseMet] = useState(false)
  const [upperCaseMet, setUpperCaseMet] = useState(false)
  const [numberMet, setNumberMet] = useState(false)
  const [specialCharMet, setSpecialCharMet] = useState(false)
  const [reqsMet, setReqsMet] = useState(false)
  const { invalidStyle } = AuthStyles
  const codeInputRef = useRef(null)
  const router = useRouter()

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  // Receive the validated username from another page
  useEffect(() => {
    const { query } = router
    if (query.username) {
      setUsername(query.username)
      setEmailValid(validateEmailDomain(query.username))
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [router.query])

  const handleRedirect = () => {
    router.push("/")
  }

  useEffect(() => {
    if (currentStep === "verifyCode" && codeInputRef.current) {
      codeInputRef.current.focus()
      setCaretToEnd(codeInputRef.current)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "success") {
      setLoading(true)
      handleRedirect()
    }
  }, [currentStep])

  const obfuscateEmail = (username) => {
    const [localPart] = username.split("@")
    if (localPart.length <= 3) {
      return `${localPart}@***`
    }
    const obfuscatedLocalPart = localPart.slice(0, 3) + "*".repeat(3)
    return `${obfuscatedLocalPart}@***`
  }

  const resetPasswordHandler = async (username) => {
    try {
      await resetPassword({ username })
    } catch (error) {
      console.error("Error resetting password:", error)
    }
  }

  const confirmResetPasswordHandler = async ({
    username,
    confirmationCode,
    newPassword,
  }) => {
    try {
      await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      })
    } catch (error) {
      console.error("Error completing password reset:", error)
    }
  }

  const handleSendCode = async (e) => {
    e.preventDefault()

    // Validate the email before submitting the initial reset form
    const isEmailValid = validateEmailDomain(username)
    if (!isEmailValid) {
      setEmailValid(false)
      emailRef.current.focus()
      return
    }

    try {
      const output = await resetPassword({ username: username })
      const { nextStep } = output
      if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
        setCurrentStep("verifyCode")
      }
    } catch (error) {
      if (error.name === "UserNotFoundException") {
        setErrorMessage(CognitoErrorMessages[error.name])
      } else if (error.name === "InvalidParameterException") {
        setErrorMessage(CognitoErrorMessages[error.name])
      } else if (error.name === "LimitExceededException") {
        setErrorMessage(CognitoErrorMessages[error.name])
        setShowError(true)
      } else {
        setErrorMessage(
          CognitoErrorMessages[error.name] ||
            "An unexpected error occurred. Please try again later.",
          setShowError(true)
        )
      }
    }
  }

  // Send the caret cursor to the end if the user tabs into the input field
  const setCaretToEnd = (input) => {
    if (input && input.value.length) {
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (!code) {
      setErrorMessage("Code cannot be empty.")
      return
    }

    try {
      // Assume code is valid since there's no API function to verify it before collecting the new password
      setCurrentStep("resetPassword")
      setErrorMessage("")
    } catch (error) {
      setErrorMessage(
        CognitoErrorMessages[error.name] ||
          "An unexpected error occurred. Please try again later."
      )
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!code || !newPassword) {
      setErrorMessage("Code and new password cannot be empty.")
      return
    }

    if (!validatePassword(newPassword)) {
      setErrorMessage("Password does not meet the requirements.")
      return
    }

    try {
      // Complete the password reset process
      await confirmResetPassword({
        username: username,
        confirmationCode: code,
        newPassword: newPassword,
      })
      setSuccessMessage("Password has been successfully reset.")
      setErrorMessage("")
      setCurrentStep("success")
    } catch (error) {
      if (error.name === "CodeMismatchException") {
        setErrorMessage(CognitoErrorMessages[error.name])
        setCurrentStep("verifyCode")
      } else if (error.name === "LimitExceededException") {
        setErrorMessage(CognitoErrorMessages[error.name])
      } else {
        setErrorMessage(
          CognitoErrorMessages[error.name] ||
            "An unexpected error occurred. Please try again later."
        )
      }
    }
  }

  const handleEmailBlur = () => {
    handleBlur(username, validateEmailDomain, setEmailValid)
  }

  const handlePasswordBlur = () => {
    handleBlur(newPassword, validatePassword, setPasswordValid)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === "username") {
      setUsername(value)
      // Reset the email validity state to true when user starts editing
      setEmailValid(true)
    } else if (name === "code") {
      if (value.length <= 6) {
        setCode(value)
      }
    } else if (name === "newPassword") {
      setNewPassword(value)
      // Reset the password validity state as soon as the user starts editing the password
      setPasswordValid(true)

      // Check password criteria
      const lengthMet = value.length >= 8 && value.length <= 20
      const lowerCaseMet = /[a-z]/.test(value)
      const upperCaseMet = /[A-Z]/.test(value)
      const numberMet = /[0-9]/.test(value)
      const specialCharMet =
        /[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]/.test(value)

      setLengthMet(lengthMet)
      setLowerCaseMet(lowerCaseMet)
      setUpperCaseMet(upperCaseMet)
      setNumberMet(numberMet)
      setSpecialCharMet(specialCharMet)

      // Set reqsMet to true if all of the criteria are met
      setReqsMet(
        lengthMet && lowerCaseMet && upperCaseMet && numberMet && specialCharMet
      )

      // Set passwordValid based on reqsMet
      setPasswordValid(
        lengthMet && lowerCaseMet && upperCaseMet && numberMet && specialCharMet
      )
    }
  }

  return (
    <>
      <Head>
        <title>Login: TechNexus</title>
        <meta property="og:title" content="Login: TechNexus" key="title" />
        <meta name="description" content="Reset your password." />
      </Head>

      {loading ? (
        <LoaderDots />
      ) : showError ? (
        <ErrorRedirect message={errorMessage} />
      ) : (
        <AuthStyles.AuthContainerWrapper>
          <AuthStyles.LogoBox>
            <Image src={LogoSymbol} alt="TechNexus Logo" priority={false} />
          </AuthStyles.LogoBox>
          {currentStep === "initial" && (
            <>
              <AuthStyles.HeaderText>Forgot Password</AuthStyles.HeaderText>
              {errorMessage && (
                <AuthStyles.ErrorMessage>
                  {errorMessage}
                </AuthStyles.ErrorMessage>
              )}
              <SubheaderText>
                <span>
                  In order to change your password, we need to verify your
                  identity. Enter the email address associated with your
                  TechNexus account.
                </span>
              </SubheaderText>
              <AuthStyles.EntryWrapper>
                <AuthStyles.EntryContainer
                  ref={emailRef}
                  onChange={onChange}
                  name="username"
                  id="username"
                  type="username"
                  placeholder=""
                  autoComplete="username"
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
              <ContinueBtn onClick={handleSendCode}>Continue</ContinueBtn>
            </>
          )}
          {currentStep === "verifyCode" && (
            <>
              <AuthStyles.HeaderText>
                Verification code sent
              </AuthStyles.HeaderText>
              {errorMessage && (
                <AuthStyles.ErrorMessage>
                  {errorMessage}
                </AuthStyles.ErrorMessage>
              )}
              <SuccessMessage>
                <span>
                  We’ve sent your code to{" "}
                  <strong>{obfuscateEmail(username)}</strong>
                </span>
                <br />
                <span>
                  Keep this browser tab open to enter your code below.
                </span>
              </SuccessMessage>
              <form
                autoComplete="off"
                style={{ width: "100%", textAlign: "center" }}
              >
                <VerificationInput
                  placeholder="Enter your code"
                  type="tel"
                  name="code"
                  value={code}
                  pattern="\d*"
                  onChange={onChange}
                  hasValue={code.length > 0}
                  onFocus={(e) => setCaretToEnd(e.target)}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Tab" &&
                      !/^[0-9]$/.test(e.key)
                    ) {
                      e.preventDefault()
                    }
                  }}
                />
                <VerifyBtn
                  onClick={handleVerifyCode}
                  disabled={code.length !== 6}
                >
                  Verify
                </VerifyBtn>
              </form>
            </>
          )}
          {currentStep === "resetPassword" && (
            <>
              <AuthStyles.HeaderText>Password Reset</AuthStyles.HeaderText>
              {errorMessage && (
                <AuthStyles.ErrorMessage>
                  {errorMessage}
                </AuthStyles.ErrorMessage>
              )}
              <SuccessMessage>
                <span>Almost done!</span>
                <br />
                <span>
                  For your security, please change your password to something
                  you haven’t used before.
                </span>
              </SuccessMessage>
              <AuthStyles.EntryWrapper>
                <AuthStyles.EntryContainer
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={newPassword}
                  name="newPassword"
                  onChange={onChange}
                  style={!passwordValid ? invalidStyle : {}}
                  onBlur={handlePasswordBlur}
                />
                <AuthStyles.Label
                  htmlFor="password"
                  style={!passwordValid ? invalidStyle : {}}
                >
                  Create password
                </AuthStyles.Label>
                <PasswordReveal
                  onClick={() => setShowPassword(!showPassword)}
                  clicked={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  role="button"
                  className="password-reveal-button"
                />
                {!passwordValid && (
                  <AuthStyles.ValidationMessage>
                    Please enter a valid password.
                  </AuthStyles.ValidationMessage>
                )}
                {reqsMet && (
                  <RequirementListItemDone>
                    <IoCheckmarkCircleSharp size={16} />
                    Your password is ready to go!
                  </RequirementListItemDone>
                )}
              </AuthStyles.EntryWrapper>
              {!reqsMet && (
                <>
                  <RequirementTitle>Must contain:</RequirementTitle>
                  <RequirementList>
                    <RequirementListItem
                      data-test={lengthMet ? "lengthSuccess" : "lengthNotMet"}
                      met={lengthMet}
                    >
                      <span>8-20 characters</span>
                    </RequirementListItem>
                  </RequirementList>
                  <RequirementTitle>And 1 of the following:</RequirementTitle>
                  <RequirementList>
                    <RequirementListItem
                      data-test={
                        lowerCaseMet ? "lowerCaseSuccess" : "lowerCaseNotMet"
                      }
                      met={lowerCaseMet}
                    >
                      <span>Lowercase letters</span>
                    </RequirementListItem>
                    <RequirementListItem
                      data-test={
                        upperCaseMet ? "upperCaseSuccess" : "upperCaseNotMet"
                      }
                      met={upperCaseMet}
                    >
                      <span>Uppercase letters</span>
                    </RequirementListItem>
                    <RequirementListItem
                      data-test={numberMet ? "numberSuccess" : "numberNotMet"}
                      met={numberMet}
                    >
                      <span>Numbers</span>
                    </RequirementListItem>
                    <RequirementListItem
                      data-test={
                        specialCharMet
                          ? "specialCharSuccess"
                          : "specialCharNotMet"
                      }
                      met={specialCharMet}
                    >
                      <span>Special characters, except {"< >"}</span>
                    </RequirementListItem>
                  </RequirementList>
                </>
              )}
              <VerifyBtn
                onClick={handleResetPassword}
                disabled={!passwordValid || !reqsMet} // Just to be safe
              >
                Create Password
              </VerifyBtn>
            </>
          )}
          {currentStep === "success" && (
            <>
              <AuthStyles.HeaderText>
                Password Reset Successful
              </AuthStyles.HeaderText>
              <SuccessMessage>{successMessage}</SuccessMessage>
            </>
          )}
        </AuthStyles.AuthContainerWrapper>
      )}
    </>
  )
}

export default ForgotPassword
