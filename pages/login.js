import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import { Auth } from "aws-amplify"
import { useRouter } from "next/router"
import styled, { keyframes } from "styled-components"
import LargeContainerFixed from "../components/common/LargeContainerFixed"
import Checkbox from "../components/common/Checkbox"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import SignUpPage from "./signup"

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

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 30px 30px 30px;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const NameWrapper = styled.div`
  margin-bottom: 10px;
`

const PasswordWrapper = styled.div`
  margin-bottom: 10px;
`

const EntryContainer = styled.input`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

  &.focus {
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
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
    border: 2px solid #4fbbff;
    border-radius: 50%;
    width: 17px;
    height: 17px;
    color: #4fbbff;
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
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px 0px;
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
  color: red;
  font-size: 14px;
  font-weight: 600;
`

const PolicyContainer = styled.div`
  display: grid;
  text-align: center;
  font-size: 12px;
  color: rgb(102, 102, 102);
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
    .Tech_Haven {
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
  const router = useRouter()
  const [token, setToken] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const infoButtonRef = useRef(null)
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)

  const handleClick = () => {
    setShowTooltip(!showTooltip)
  }

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp)
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-])[a-zA-Z0-9\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]{8,98}$/
    return pattern.test(password)
  }

  // Apply red border/text if information is invalid
  const invalidStyle = { borderColor: "red", color: "red" }

  const signIn = async () => {
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

      const signInResponse = await Auth.signIn(username, password)
      console.log("Sign-in response:", signInResponse)
      const { signInUserSession } = signInResponse
      if (keepSignedIn && signInUserSession) {
        const { accessToken } = signInUserSession
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
      }
      // Navigate to another page
      router.push("/index")
    } catch (error) {
      console.error("Error signing in:", error)
      // Extract the error message and type from the log
      const errorMessage = error.message
      const errorType = errorMessage.split(" ")[1]

      if (error.code && cognitoErrorMessages[error.code]) {
        setErrorMessage(cognitoErrorMessages[error.code])
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.")
      }
    }
  }

  const forgotPassword = async () => {
    try {
      await Auth.forgotPassword(username)
      // Redirect on error
    } catch (error) {
      console.error("Error initiating forgot password:", error)
      if (error.code && cognitoErrorMessages[error.code]) {
        setErrorMessage(cognitoErrorMessages[error.code])
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
      ) : (
        <>
          <Head>
            <title>Login: TechNexus</title>
            <meta name="description" content={`Sign In to TechNexus`} />
            <meta
              property="og:title"
              content="Sign In to TechNexus"
              key="title"
            />
          </Head>
          <LargeContainerFixed>
            <LoginPageWrapper>
              <Logo>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 1500 440"
                >
                  <defs>
                    <filter id="Filter_0">
                      <feFlood
                        floodColor="rgb(0, 81, 121)"
                        floodOpacity="1"
                        result="floodOut"
                      />
                      <feComposite
                        operator="atop"
                        in="floodOut"
                        in2="SourceGraphic"
                        result="compOut"
                      />
                      <feBlend mode="normal" in="compOut" in2="SourceGraphic" />
                    </filter>
                  </defs>
                  <g filter="url(#Filter_0)">
                    <path
                      fillRule="evenodd"
                      fill="rgb(0, 81, 121)"
                      d="M1430.614,437.080 C1428.514,443.080 1424.314,446.080 1418.014,446.080 L1360.714,446.080 C1354.413,432.580 1338.513,401.980 1324.113,373.779 C1315.713,356.979 1306.713,340.179 1297.113,321.279 C1295.913,323.979 1254.512,442.780 1256.912,437.080 C1254.812,443.080 1250.612,446.080 1244.312,446.080 L1183.112,446.080 C1192.412,417.880 1232.912,303.579 1249.712,254.378 L1231.412,242.078 C1228.112,239.978 1229.912,236.078 1233.212,236.078 L1326.513,236.078 L1392.214,371.979 L1397.914,327.879 L1429.714,236.078 L1500.215,236.078 L1430.614,437.080 ZM1213.864,210.080 L1152.963,210.080 L1180.563,129.679 L1056.962,129.679 C1053.662,129.679 1052.462,133.279 1054.562,135.379 L1069.862,149.179 C1053.062,191.180 1055.762,210.080 1039.562,210.080 L978.061,210.080 C978.661,207.080 991.262,172.580 1005.662,131.479 C1020.062,90.979 1035.962,44.178 1044.962,18.378 C1038.962,13.878 1032.962,9.978 1026.062,6.378 C1023.362,4.278 1024.562,0.078 1027.862,0.078 L1102.863,0.078 C1112.463,0.078 1118.763,9.078 1115.463,17.778 L1094.163,78.679 L1198.264,78.679 L1225.564,0.078 L1296.665,0.078 L1226.464,201.080 C1224.364,207.080 1220.164,210.080 1213.864,210.080 ZM972.364,50.778 L785.762,50.778 C782.462,50.778 781.262,54.678 783.662,56.778 L801.363,72.679 L772.862,155.479 C772.262,157.579 773.162,159.079 775.262,159.380 L945.664,159.380 L931.564,201.080 C929.464,206.780 924.664,210.080 918.964,210.080 L723.962,210.080 C703.862,210.080 690.361,190.280 696.661,171.380 C713.162,123.979 744.662,36.978 750.962,18.378 L732.062,6.078 C729.362,3.978 730.562,0.078 733.862,0.078 L999.065,0.078 L985.264,41.778 C983.164,47.478 978.064,50.778 972.364,50.778 ZM685.264,50.778 L528.362,50.778 C525.062,50.778 523.862,54.678 526.262,56.778 L542.463,71.479 L537.962,83.779 L640.564,83.779 L628.863,117.379 C626.763,123.079 621.963,126.379 616.263,126.379 L509.162,126.379 C505.862,126.379 504.662,129.979 506.762,132.079 L517.862,142.279 L511.862,159.380 L657.364,159.380 L642.664,201.080 C640.564,207.080 636.363,210.080 630.063,210.080 L464.162,210.080 C444.662,210.080 430.561,190.580 437.161,171.980 L489.662,18.378 C488.762,16.878 479.762,10.878 472.262,6.078 C469.562,3.978 470.762,0.078 474.062,0.078 L712.264,0.078 L697.864,41.778 C695.764,47.478 690.964,50.778 685.264,50.778 ZM432.964,50.778 L357.963,50.778 C354.663,50.778 353.463,54.678 355.863,56.778 L374.163,73.579 L330.063,201.080 C327.963,207.080 323.763,210.080 317.463,210.080 L256.262,210.080 L311.762,50.778 L224.162,50.778 C224.762,48.678 236.462,21.678 237.362,18.378 L216.962,6.378 C213.661,4.278 215.161,0.078 218.462,0.078 L460.264,0.078 C456.964,9.978 449.464,30.078 445.564,41.778 C443.464,47.778 439.264,50.778 432.964,50.778 ZM116.613,314.679 L220.714,314.679 L248.014,236.078 L319.115,236.078 L248.914,437.080 C246.814,443.080 242.614,446.080 236.314,446.080 L175.413,446.080 L203.014,365.679 L79.412,365.679 C76.112,365.679 74.912,369.279 77.012,371.379 L92.313,385.179 C75.512,427.180 78.212,446.080 62.012,446.080 L0.512,446.080 C1.112,443.080 13.712,408.580 28.112,367.479 C42.512,326.979 58.412,280.178 67.412,254.378 C61.412,249.878 55.412,245.978 48.512,242.378 C45.812,240.278 47.012,236.078 50.312,236.078 L125.313,236.078 C134.913,236.078 141.213,245.078 137.913,253.778 L116.613,314.679 ZM354.512,242.078 C351.812,239.978 353.012,236.078 356.312,236.078 L620.015,236.078 C610.415,263.678 564.214,400.180 552.214,437.080 C550.114,443.080 545.914,446.080 539.614,446.080 L477.514,446.080 L496.114,395.380 L395.013,395.380 L380.613,437.080 C378.513,443.080 374.312,446.080 368.012,446.080 L306.812,446.080 C318.812,409.180 359.612,295.478 372.812,254.678 L354.512,242.078 ZM510.814,352.779 L530.914,293.978 C532.714,289.178 530.614,286.778 524.614,286.778 L416.913,286.778 C413.613,286.778 412.413,290.678 414.813,292.778 L426.813,303.579 L409.713,352.779 L510.814,352.779 ZM641.612,236.078 L728.913,236.078 L746.613,334.179 L743.313,374.979 C743.013,378.279 747.213,379.779 749.313,377.379 C796.413,321.279 815.914,297.279 864.814,240.578 C867.814,237.578 871.114,236.078 875.014,236.078 L944.615,236.078 C919.115,264.878 790.113,414.880 766.413,441.580 C763.713,444.580 760.413,446.080 756.213,446.080 L692.912,446.080 C686.912,412.480 663.212,273.578 659.312,254.678 C653.612,250.478 661.412,256.178 640.112,242.078 C637.412,239.978 638.312,236.378 641.612,236.078 ZM978.512,254.378 C977.612,252.878 968.612,246.878 961.112,242.078 C958.412,239.978 959.612,236.078 962.912,236.078 L1201.114,236.078 L1186.714,277.778 C1184.614,283.478 1179.814,286.778 1174.114,286.778 L1017.213,286.778 C1013.913,286.778 1012.713,290.678 1015.113,292.778 L1031.313,307.479 L1026.813,319.779 L1129.414,319.779 L1117.714,353.379 C1115.614,359.079 1110.814,362.379 1105.114,362.379 L998.012,362.379 C994.712,362.379 993.512,365.979 995.612,368.079 L1006.713,378.279 L1000.712,395.380 L1146.214,395.380 L1131.514,437.080 C1129.414,443.080 1125.214,446.080 1118.914,446.080 L953.012,446.080 C933.512,446.080 919.412,426.580 926.012,407.980 L978.512,254.378 Z"
                    />
                  </g>
                </svg>
              </Logo>
              <HeaderText>Sign in to TechNexus</HeaderText>
              <NameWrapper>
                <AccountText htmlFor="username">Email address</AccountText>
                <InputIconWrapper>
                  <EntryContainer
                    onChange={onChange}
                    name="username"
                    id="username"
                    type="text"
                    placeholder=""
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
              <ResetText href="#" onClick={forgotPassword}>
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
                      closing the browser. Only use this feature on your
                      personal device.
                    </InfoTooltip>
                  )}
                </TooltipContainer>
              </KeepSignInWrapper>
              <EntryBtnWrapper>
                <SignInBtn onClick={signIn} type="button">
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
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </LoginPageWrapper>
          </LargeContainerFixed>
        </>
      )}
    </>
  )
}

export default Login
