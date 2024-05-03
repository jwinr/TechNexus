import React, { useState, useEffect, useRef } from "react"
import { Auth } from "aws-amplify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPen } from "@fortawesome/free-solid-svg-icons"
import { LiaHeart } from "react-icons/lia"
import { LiaUser } from "react-icons/lia"
import { CiViewList } from "react-icons/ci"
import { IoIosLogOut } from "react-icons/io"
import { HiOutlineCog8Tooth } from "react-icons/hi2"
import styled from "styled-components"
import Backdrop from "../common/Backdrop"
import { StyleSheetManager } from "styled-components"

import { RiArrowDownSLine } from "react-icons/ri"

import { LiaUserCircleSolid } from "react-icons/lia"

import SignInPage from "../../pages/login"
import SignUpPage from "../../pages/signup"

const Dropdown = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 768px) {
    grid-area: nav-user;
  }
`

const AccDropdown = styled.div`
  position: absolute;
  top: 65px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  width: 275px;
  right: 14px; /* Position the user dropdown underneath the account button */
  display: none;
  z-index: -100;
  height: ${({ $menuHeight }) => $menuHeight}px;
  transition: height 0.3s cubic-bezier(0.3, 0.85, 0, 1);
  overflow-y: hidden;

  @media (max-width: 768px) {
    width: auto;
  }

  &.active {
    display: block;
    opacity: 1;
    visibility: visible;
    transition: 0.3s cubic-bezier(0.3, 0.85, 0, 1);
    transform-origin: top;
  }

  &.inactive {
    display: block;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s cubic-bezier(0.3, 0.85, 0, 1);
    top: -1000px;
    transform-origin: top;
  }
`

const AccPillBtn = styled.button`
  font-size: 15px;
  cursor: pointer;
  color: #fff;
  padding-left: 16px;
  padding-right: 8px;
  height: 100%;
  border-radius: 10px;
  position: relative;
  align-items: center;
  display: flex;
  width: fit-content;
  justify-content: flex-end;
  background-color: ${({ isOpen }) => (isOpen ? "#00599c" : "#266aca")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ isOpen }) => (isOpen ? "#00599c" : "#00599c")};
  }

  &:active {
    background-color: ${({ isOpen }) => (isOpen ? "#00599c" : "#00599c")};
  }

  &:hover .arrow-icon,
  &.arrow-icon-visible .arrow-icon {
    opacity: 1;
  }
`

const IconContainer = styled.div`
  font-size: 26px;
  justify-content: center;
  display: grid;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const AccTextContainer = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  align-content: center;
  display: grid;
  padding-left: 5px;

  @media (max-width: 768px) {
    display: none; /* Hiding the account text until I figure out where I want it on mobile.. */
  }
`

const DropdownWrapper = styled.div`
  padding-bottom: 15px;
`

const UserDropdown = () => {
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [menuHeight, setMenuHeight] = useState(null)
  const dropdownRef = useRef()

  useEffect(() => {
    const updateHeight = () => {
      if (dropdownRef.current) {
        const height = dropdownRef.current.scrollHeight + "px"
        dropdownRef.current.style.setProperty("--menuHeight", height)
      }
    }

    if (isUserOpen) {
      updateHeight()
      // Could setup a resize observer for dropdownRef.current to handle dynamic content changes..
    } else {
      // Reset the height when the dropdown is not open
      dropdownRef.current.style.removeProperty("--menuHeight")
    }
  }, [isUserOpen, user, showSignIn, showSignUp]) // Variables that affect the content height

  const toggleDropdown = () => {
    setIsUserOpen(!isUserOpen)
    setShowSignIn(false)
    setShowSignUp(false)
  }

  const closeMenu = () => {
    setIsUserOpen(false)
  }

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn) // Toggle the sign-in form display
  }

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp) // Toggle the Sign-Up component
  }

  let userRef = useRef()

  useEffect(() => {
    let handler = (e) => {
      if (!userRef.current.contains(e.target)) {
        setIsUserOpen(false)
      }
    }

    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [])

  const checkUser = async () => {
    try {
      const data = await Auth.currentAuthenticatedUser()
      setUser(data)
    } catch (error) {
      // Handle the case where no user is signed in
      setUser(null)
      console.error("No user signed in:", error)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const handleSignInSuccess = () => {
    setIsUserOpen(false) // Close the dropdown after successful sign-in
  }

  const userName = user
    ? `${user.attributes.given_name} ${user.attributes.family_name}`
    : "Returning customer?"

  const signOut = async () => {
    try {
      await Auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("error signing out", error)
    }
  }

  useEffect(() => {
    // Function to disable scroll
    const disableScroll = () => {
      document.body.style.overflowY = "hidden"
      document.body.style.paddingRight = "15px"
      document.body.style.touchAction = "none"
      document.body.style.overscrollBehavior = "none"
    }

    // Function to enable scroll
    const enableScroll = () => {
      document.body.style.overflowY = "auto"
      document.body.style.paddingRight = "inherit"
      document.body.style.touchAction = "auto"
      document.body.style.overscrollBehavior = "auto"
    }

    // Event listeners to disable/enable scroll based on dropdown state
    if (isUserOpen) {
      disableScroll()
    } else {
      enableScroll()
    }

    // Cleanup function to enable scroll when component unmounts
    return () => {
      enableScroll()
    }
  }, [isUserOpen])

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => prop !== "isOpen" && prop !== "$menuHeight"}
    >
      <Dropdown ref={userRef}>
        <AccPillBtn
          isOpen={isUserOpen}
          onClick={toggleDropdown}
          className={isUserOpen ? "arrow-icon-visible" : ""}
        >
          <IconContainer>
            <LiaUserCircleSolid />
          </IconContainer>
          <AccTextContainer>Account</AccTextContainer>
          <div className="arrow-icon">
            {isUserOpen ? (
              <RiArrowDownSLine className="arrow-icon rotate-arrow" />
            ) : (
              <RiArrowDownSLine className="arrow-icon" />
            )}
          </div>
        </AccPillBtn>
        <Backdrop isOpen={isUserOpen} onClick={closeMenu} />
        <AccDropdown
          ref={dropdownRef}
          className={isUserOpen ? "active" : "inactive"}
          style={{ height: "var(--menuHeight, auto)" }}
        >
          {user && (
            <DropdownWrapper>
              <ul className="user-info-list">
                <div className="category-list-header">{userName}</div>
                <li className="user-item">
                  <CiViewList className="user-info-icon" />
                  <a href="#">Orders</a>
                </li>
                <li className="user-item">
                  <LiaHeart className="user-info-icon" />
                  <a href="#">Wishlist</a>
                </li>
                <li className="user-item">
                  <LiaUser className="user-info-icon" />
                  <a href="#">Profile</a>
                </li>
                <li className="user-item">
                  <HiOutlineCog8Tooth className="user-info-icon" />
                  <a href="#">Account Settings</a>
                </li>
                <li className="user-item">
                  <IoIosLogOut className="user-info-icon" />
                  <a href="#" onClick={signOut}>
                    Logout
                  </a>
                </li>
              </ul>
            </DropdownWrapper>
          )}
          {!user && (
            <>
              {showSignIn && (
                // Show sign in form
                <DropdownWrapper>
                  <SignInPage
                    isUserOpen={isUserOpen}
                    onSignInSuccess={handleSignInSuccess}
                  />
                </DropdownWrapper>
              )}
              {!showSignUp && !showSignIn && (
                // Show the sign in / registration buttons only if we aren't showing the other forms
                <>
                  <button
                    className="user-dropdown-signup-btn"
                    onClick={toggleSignIn}
                  >
                    Sign In
                  </button>
                  <button className="user-item" onClick={toggleSignUp}>
                    <FontAwesomeIcon
                      icon={faUserPen}
                      className="user-info-icon"
                    />
                    Create Account
                  </button>
                </>
              )}
            </>
          )}
          {showSignUp && (
            // Show sign up form
            <DropdownWrapper>
              <SignUpPage isUserOpen={isUserOpen} />
            </DropdownWrapper>
          )}
        </AccDropdown>
      </Dropdown>
    </StyleSheetManager>
  )
}

export default UserDropdown
