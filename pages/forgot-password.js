import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { resetPassword } from "aws-amplify/auth"

const ResetPasswordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
`

const EntryContainer = styled.input`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #a1a1a1;
  border-radius: 0.25rem;
  width: 350px;
  padding: 10px;
  color: #333;
  outline: none;

  &.focus {
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
`

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 23px;
  padding: 5px;
`

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  padding: 10px 0;
`

const SuccessMessage = styled.div`
  color: #2e7d32;
  font-size: 14px;
  padding: 10px 0;
`

const ResetBtn = styled.button`
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px 0px;
  border-radius: 6px;
  padding: 8px 20px;
  color: #fff;
  width: 350px;
  background-color: #00599c;
  transition: background-color 0.2s;

  &:hover {
    background-color: #002d62;
  }

  &:active {
    background-color: #002d62;
  }
`

const ForgotPassword = ({ username, isEmailValid }) => {
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [email, setEmail] = useState(username || "")
  const [emailValid, setEmailValid] = useState(isEmailValid)
  const [isCodeSent, setIsCodeSent] = useState(false)

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

  const handleSendCode = () => {
    if (validateEmailDomain(email)) {
      setIsCodeSent(true)
      setErrorMessage("")
    } else {
      setErrorMessage("Invalid email address. Please enter a valid email.")
      setIsEmailValid(false)
    }
  }

  const handleResetPassword = async () => {
    try {
      await resetPassword(email, code, newPassword)
      setSuccessMessage(
        "Password reset successfully. You can now sign in with your new password."
      )
      setErrorMessage("")
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again.")
      setSuccessMessage("")
    }
  }

  return (
    <ResetPasswordWrapper>
      {isEmailValid && isCodeSent ? (
        <>
          <HeaderText>Reset Password</HeaderText>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          <EntryContainer
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <EntryContainer
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <ResetBtn onClick={handleResetPassword}>Reset Password</ResetBtn>
        </>
      ) : isEmailValid ? (
        <>
          <HeaderText>Reset Password</HeaderText>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <SuccessMessage>
            We will send a code to {email} so that you can get back into your
            account.
          </SuccessMessage>
          <ResetBtn onClick={handleSendCode}>Send Code</ResetBtn>
        </>
      ) : (
        <>
          <HeaderText>Reset Password</HeaderText>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <EntryContainer
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ResetBtn onClick={handleSendCode}>Continue</ResetBtn>
        </>
      )}
    </ResetPasswordWrapper>
  )
}

export default ForgotPassword
