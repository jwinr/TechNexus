import React, { Component } from "react"
import { Auth } from "aws-amplify"
import styled from "styled-components"
import * as Styled from "./SignStyles"

class SignIn extends Component {
  state = {
    username: "",
    password: "",
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  signIn = async () => {
    const { username, password } = this.state
    try {
      const signInResponse = await Auth.signIn({
        username,
        password,
      })
      console.log("Sign-in response:", signInResponse)
      // Update the isOpen state if the login is correct
      this.props.onSignInSuccess()
    } catch (error) {
      console.error("Error signing in:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
  }

  forgotPassword = async () => {
    const { username } = this.state
    try {
      await Auth.forgotPassword(username)
      // Redirect or show a confirmation message to the user
    } catch (error) {
      console.error("Error initiating forgot password:", error)
      // Handle error, display an error message, etc.
    }
  }

  render() {
    return (
      <>
        <Styled.HeaderText>Sign in</Styled.HeaderText>
        <Styled.NameWrapper>
          <Styled.AccountText htmlFor="username">
            Email address
          </Styled.AccountText>
          <Styled.EntryContainer
            onChange={this.onChange}
            name="username"
            id="username"
            type="text"
            placeholder=""
          />
        </Styled.NameWrapper>
        <Styled.PasswordWrapper>
          <Styled.AccountText htmlFor="password">Password</Styled.AccountText>
          <Styled.EntryContainer
            onChange={this.onChange}
            name="password"
            id="password"
            type="password"
            placeholder=""
          />
        </Styled.PasswordWrapper>
        <Styled.Divider />
        <Styled.EntryBtnWrapper>
          <Styled.SignInBtn onClick={this.signIn} type="button">
            Sign In
          </Styled.SignInBtn>
          <Styled.ResetText
            href="#"
            onClick={this.forgotPassword} // Trigger forgotPassword function
          >
            Forgot Password?
          </Styled.ResetText>
        </Styled.EntryBtnWrapper>
      </>
    )
  }
}

export default SignIn
