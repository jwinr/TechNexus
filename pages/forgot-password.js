import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import styled from "styled-components"
import { resetPassword, confirmResetPassword } from "aws-amplify/auth"
import { useRouter } from "next/router"
import LogoSymbol from "../public/logo_n.svg"
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import AuthContainerWrapper from "../components/auth/AuthContainerWrapper"
import { IoCheckmarkCircleSharp } from "react-icons/io5"
import LoadingSpinner from "../components/common/LoadingSpinner"

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

const EntryWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  margin: 10px 0;
`

const EntryContainer = styled.input`
  border: 1px solid var(--color-border-gray);
  border-radius: 0.25rem;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: var(--color-text-dark);
  line-height: 1.25;
  padding-right: 40px;
  transition: border-color 0.3s;

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0px;
    left: 10px;
    font-size: 12px;
    color: var(--color-text-dark);
  }
`

const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--color-text-dark);
  background-color: var(--color-main-white);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
`

const ValidationMessage = styled.div`
  position: absolute;
  color: #d32f2f;
  font-size: 14px;
  bottom: -20px;
`

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 23px;
  padding: 5px;
`

const ErrorMessage = styled.div`
  display: flex;
  color: #d32f2f;
  font-size: 14px;
  padding: 10px 0;
`

const SuccessMessage = styled.div`
  font-size: 16px;
  text-align: center;
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

const ResetBtn = styled.button`
  font-weight: bold;
  align-self: center;
  border-radius: 6px;
  color: ${(props) => (props.disabled ? "#666666" : "#fff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  background-color: ${(props) =>
    props.disabled ? "rgb(214, 214, 214)" : "#00599c"};
  transition: background-color 0.2s;
  margin-top: 24px;

  &:disabled {
    cursor: not-allowed;
    color: var(
      --color-button-dark-gray
    ) !important; // Override the hover & active styles when the button is disabled
    background-color: var(--color-button-light-gray) !important;
  }

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

const SubheaderText = styled.div`
  font-size: 19px;
  margin-bottom: 24px;
  text-align: center;
`

const Logo = styled.div`
  display: flex;
  align-self: center;
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

const VerificationInput = styled.input`
  border-width: 0px 0px 4px;
  border-bottom-style: solid;
  border-bottom-color: var(--color-button-light-gray);
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
  color: ${(props) => (props.disabled ? "#666666" : "#fff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  background-color: ${(props) =>
    props.disabled ? "rgb(214, 214, 214)" : "#00599c"};
  transition: background-color 0.2s;
  margin-top: 24px;

  &:disabled {
    cursor: not-allowed;
    color: var(
      --color-button-dark-gray
    ) !important; // Override the hover & active styles when the button is disabled
    background-color: var(--color-button-light-gray) !important;
  }

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
  color: rgb(102, 102, 102);
  padding-left: 20px;
  margin: 8px 0px 0px;
  align-self: flex-start;
`

const RequirementListItem = styled.li`
  margin-bottom: 4px;
  color: rgb(0, 131, 0);
  list-style: none;
  margin-left: -12px;

  color: ${(props) => (props.met ? "rgb(0, 131, 0)" : "#d32f2f")};

  &:before {
    content: ${(props) => (props.met ? "'✓'" : "''")};
    padding-right: ${(props) => (props.met ? "4px" : "0px")};
    font-weight: bold;
    margin-left: ${(props) => (props.met ? "-12px" : "0px")};
  }
`

const RequirementListItemDone = styled.div`
  position: absolute;
  color: var(--color-success-green);
  font-size: 14px;
  bottom: -20px;

  svg {
    display: inline-block;
    margin-right: 6px;
  }
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(-63px + 100vh);
`

const ForgotPassword = ({ username, isEmailValid, resetPasswordStep }) => {
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [email, setEmail] = useState(username || "")
  const [emailValid, setEmailValid] = useState(true)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState("initial")
  const [loading, setLoading] = useState(false)

  const [lengthMet, setLengthMet] = useState(false)
  const [lowerCaseMet, setLowerCaseMet] = useState(false)
  const [upperCaseMet, setUpperCaseMet] = useState(false)
  const [numberMet, setNumberMet] = useState(false)
  const [specialCharMet, setSpecialCharMet] = useState(false)
  const [reqsMet, setReqsMet] = useState(false)

  const codeInputRef = useRef(null)

  const router = useRouter()

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

  useEffect(() => {
    if (username) {
      setEmail(username)
      setEmailValid(isEmailValid)
    }
  }, [username, isEmailValid])

  const validateEmailDomain = (email) => {
    const regex = /.+@\S+\.\S+$/
    return regex.test(email)
  }

  const obfuscateEmail = (email) => {
    const [localPart] = email.split("@")
    if (localPart.length <= 3) {
      return `${localPart}@***`
    }
    const obfuscatedLocalPart = localPart.slice(0, 3) + "*".repeat(3)
    return `${obfuscatedLocalPart}@***`
  }

  // Mock resetPassword function
  const resetPasswordMock = async ({ username }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          nextStep: {
            resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE",
            codeDeliveryDetails: {
              deliveryMedium: "email",
            },
          },
        })
      }, 1000) // simulate async call with 1-second delay
    })
  }

  // Mock confirmResetPassword function
  const confirmResetPasswordMock = async ({
    username,
    confirmationCode,
    newPassword,
  }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000) // simulate async call with 1-second delay
    })
  }

  const handleSendCode = async (e) => {
    e.preventDefault()

    // Validate the email before submitting the initial reset form
    const isEmailValid = validateEmailDomain(email)
    if (!isEmailValid) {
      setEmailValid(false)
      return
    }

    try {
      setFormSubmitted(true)
      const output = await resetPasswordMock({ username: email }) // Use mock function in development
      const { nextStep } = output
      if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
        const codeDeliveryDetails = nextStep.codeDeliveryDetails
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        )
        setIsCodeSent(true)
        setCurrentStep("verifyCode")
      }
    } catch (error) {
      setErrorMessage(
        cognitoErrorMessages[error.name] ||
          "An unexpected error occurred. Please try again later."
      )
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
      // Assume code is valid if not mock validate code
      setCurrentStep("resetPassword")
      setErrorMessage("")
    } catch (error) {
      setErrorMessage(
        cognitoErrorMessages[error.name] ||
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
      await confirmResetPasswordMock({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      })
      setSuccessMessage("Password has been successfully reset.")
      setErrorMessage("")
      setCurrentStep("success")
    } catch (error) {
      setErrorMessage(
        cognitoErrorMessages[error.name] ||
          "An unexpected error occurred. Please try again later."
      )
    }
  }

  const handleEmailBlur = () => {
    if (email.trim().length === 0) {
      // Reset email validity only if the field is empty when blurred
      setEmailValid(true)
    } else {
      setEmailValid(validateEmailDomain(email))
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === "username") {
      setEmail(value)
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

  const handlePasswordBlur = () => {
    if (newPassword.trim().length === 0) {
      // Reset password validity only if the field is empty when blurred
      setPasswordValid(true)
    } else {
      // Validate password if field is not empty
      setPasswordValid(validatePassword(newPassword))
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

  if (loading) {
    return (
      <SpinnerContainer>
        <LoadingSpinner />
      </SpinnerContainer>
    )
  }

  return (
    <>
      <Head>
        <title>Login: TechNexus</title>
        <meta property="og:title" content="Login: TechNexus" key="title" />
      </Head>
      <AuthContainerWrapper>
        <Logo>
          <LogoSymbol />
        </Logo>
        {currentStep === "initial" && (
          <>
            <HeaderText>Forgot Password</HeaderText>
            <SubheaderText>
              <span>
                In order to change your password, we need to verify your
                identity. Enter the email address associated with your TechNexus
                account.
              </span>
            </SubheaderText>
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
                value={email}
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
            <ResetBtn onClick={handleSendCode}>Continue</ResetBtn>
          </>
        )}
        {currentStep === "verifyCode" && (
          <>
            <HeaderText>Verification code sent</HeaderText>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <SuccessMessage>
              <span>
                We’ve sent your code to <strong>{obfuscateEmail(email)}</strong>
              </span>
              <br />
              <span>Keep this browser tab open to enter your code below.</span>
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
            <HeaderText>Password Reset</HeaderText>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <SuccessMessage>
              <span>Almost done!</span>
              <br />
              <span>
                For your security, please change your password to something you
                haven’t used before.
              </span>
            </SuccessMessage>
            <EntryWrapper>
              <EntryContainer
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={newPassword}
                name="newPassword"
                onChange={onChange}
                style={!passwordValid ? invalidStyle : {}}
                onBlur={handlePasswordBlur}
              />
              <Label
                htmlFor="password"
                style={!passwordValid ? invalidStyle : {}}
              >
                Create password
              </Label>
              <IconButton onClick={() => setShowPassword(!showPassword)}>
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
              {reqsMet && (
                <RequirementListItemDone>
                  <IoCheckmarkCircleSharp size={16} />
                  Your password is ready to go!
                </RequirementListItemDone>
              )}
            </EntryWrapper>
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
            <ResetBtn
              onClick={handleResetPassword}
              disabled={!passwordValid || !reqsMet} // Just to be safe
            >
              Create Password
            </ResetBtn>
          </>
        )}
        {currentStep === "success" && (
          <>
            <HeaderText>Password Reset Successful</HeaderText>
            <SuccessMessage>{successMessage}</SuccessMessage>
          </>
        )}
      </AuthContainerWrapper>
    </>
  )
}

export default ForgotPassword
