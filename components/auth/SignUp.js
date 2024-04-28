import React, { useState } from "react"
import { Auth } from "aws-amplify"
import * as Styled from "../../components/auth/SignStyles"
import { useRouter } from "next/router"

const SignUpPage = ({ toggleSignUp }) => {
  const [formData, setFormData] = useState({
    username: "",
    given_name: "",
    family_name: "",
    password: "",
  })

  const router = useRouter()

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const signUp = async () => {
    const { username, given_name, family_name, password } = formData
    try {
      const signUpResponse = await Auth.signUp({
        username,
        password,
        attributes: {
          given_name,
          family_name,
        },
      })
      console.log("Sign-up response:", signUpResponse)
      // Navigate to another page or handle the sign-up logic
    } catch (error) {
      if (error.code === "UsernameExistsException") {
        alert(
          "An account with the given email already exists. Please use a different email."
        )
      } else {
        alert("Error signing up. Please try again.")
      }
    }
  }

  return (
    <>
      <Styled.CreateText>Create your TechNexus account</Styled.CreateText>
      <Styled.NameWrapper>
        <Styled.AccountText htmlFor="username">Email</Styled.AccountText>
        <Styled.EntryContainer
          onChange={onChange}
          name="username"
          id="username"
          type="text"
          placeholder=""
        />
      </Styled.NameWrapper>
      <Styled.NameWrapper>
        <Styled.AccountText htmlFor="given_name">First Name</Styled.AccountText>
        <Styled.EntryContainer
          onChange={onChange}
          name="given_name"
          id="given_name"
          type="text"
          placeholder=""
        />
      </Styled.NameWrapper>
      <Styled.NameWrapper>
        <Styled.AccountText htmlFor="family_name">Last Name</Styled.AccountText>
        <Styled.EntryContainer
          onChange={onChange}
          name="family_name"
          id="family_name"
          type="text"
          placeholder=""
        />
      </Styled.NameWrapper>
      <Styled.NameWrapper>
        <Styled.AccountText htmlFor="password">
          Create Password
        </Styled.AccountText>
        <Styled.EntryContainer
          onChange={onChange}
          name="password"
          id="password"
          type="password"
          placeholder=""
        />
      </Styled.NameWrapper>
      {/* Need logic for confirming passwords */}
      <Styled.EntryBtnWrapper>
        <Styled.SignInBtn onClick={signUp} type="button">
          Sign Up
        </Styled.SignInBtn>
        {/* Next.js Link component for navigation or router.push() */}
        <Styled.ResetText
          href="#"
          onClick={() => {
            /* Handle navigation to sign-in page */
          }}
        >
          Existing user?
        </Styled.ResetText>
      </Styled.EntryBtnWrapper>
    </>
  )
}

export default SignUpPage
