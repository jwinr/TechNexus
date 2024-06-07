import React, { useState, useEffect, useRef, useCallback } from "react"
import styled from "styled-components"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import { LiaUserCircleSolid } from "react-icons/lia"
import { CSSTransition } from "react-transition-group"
import Link from "next/link"
import Backdrop from "../common/Backdrop"
import { getCurrentUser, fetchAuthSession, signOut } from "aws-amplify/auth"
import { filter } from "../../utils/helpers.js"
import { config } from "../../utils/config.js"
import { useRouter } from "next/router"

const FilteredDiv = filter("div")(["isOpen"])

const Dropdown = styled(FilteredDiv)`
  position: absolute;
  top: 65px;
  width: 275px;
  background-color: var(--color-main-white);
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  overflow: hidden;
  z-index: -100;
  box-sizing: content-box;
  transition: visibility 0s, transform 0.3s cubic-bezier(0.3, 0.85, 0, 1),
    height var(--speed) ease;
  right: ${(props) => props.right}px; // Dynamic right position
  transform: translateY(-1000px); // Initially move it up slightly and hide

  &.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0); // Slide it into place
  }

  &.invisible {
    opacity: 0;
    transform: translateY(-1000px);
  }

  &.initial-hidden {
    transform: translateY(-1000px);
    transition: none;
  }

  @media (max-width: 768px) {
    top: 125px;
  }
`

const buttonFilter = filter("button")

const UserButton = buttonFilter(["isOpen"])

const StyledUserButton = styled(UserButton)`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-text-dark);
  padding-left: 16px;
  padding-right: 8px;
  height: 100%;
  border-radius: 10px;
  align-items: center;
  display: flex;
  width: fit-content;
  justify-self: flex-end;
  background-color: ${({ isOpen }) => (isOpen ? "#f7f7f7" : "#fff")};
  transition: background-color 0.3s;
  border: 1px dashed transparent;

  &:hover {
    background-color: var(--color-main-light-gray);
  }

  &:focus-visible {
    outline: var(--focus-outline);
    outline-offset: var(--focus-outline-offset);
  }

  &:hover .arrow-icon,
  &.arrow-icon-visible .arrow-icon {
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 28px;
    grid-area: nav-user;
    width: fit-content;
    padding: 0px;

    &:hover {
      background-color: transparent;
    }
  }

  &.initial-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: none;
  }
`

const Menu = styled.div`
  width: 100%;

  & a:focus {
    text-decoration: underline;
    outline: none;
  }
`

const MenuItem = styled.li`
  height: 50px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  transition: background var(--speed);
  font-size: 16px;
  color: #000;
  width: 100%;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    text-decoration: underline;
    outline: none;
  }
`

const ListHeader = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  transition: background var(--speed);
  font-size: 18px;
  font-weight: 600;
  color: #000;
  width: 100%;
  text-decoration: none;

  &:focus {
    text-decoration: underline;
    outline: none;
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

const BtnText = styled.div`
  padding: 0 5px;
`

const UserDropdown = ({ isOpen: parentIsOpen, onToggle }) => {
  const [user, setUser] = useState(null)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {}, [parentIsOpen])

  /* const checkUser = async () => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser()

      setUser({ username, userId, signInDetails })
    } catch (error) {
      setUser(null)
      console.error("No user signed in:", error)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])
  */

  const mockGetCurrentUser = async () => {
    // Simulate a delay to mimic the actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock user data
    return {
      username: "mockUser",
      userId: "mockUserId",
      signInDetails: {
        lastSignIn: "2024-06-06T12:34:56Z",
      },
    }
  }

  const checkUser = async () => {
    try {
      // Replace getCurrentUser with mockGetCurrentUser for development
      const { username, userId, signInDetails } = await mockGetCurrentUser()

      setUser({ username, userId, signInDetails })
    } catch (error) {
      setUser(null)
      console.error("No user signed in:", error)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <NavItem isOpen={isMounted && parentIsOpen} onToggle={onToggle} user={user}>
      <DropdownMenu
        isOpen={isMounted && parentIsOpen}
        user={user}
        handleSignOut={handleSignOut}
      />
    </NavItem>
  )
}

const useScrollControl = () => {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false)

  // Function to disable scrolling and add padding to compensate for scrollbar removal
  const disableScroll = useCallback(() => {
    // Calculate the width of the scrollbar
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflowY = "hidden"
    // Add padding to the right to compensate for the removed scrollbar
    document.body.style.paddingRight = `${scrollBarWidth}px`
    document.body.style.touchAction = "none"
    document.body.style.overscrollBehavior = "none"
  }, [])

  // Function to enable scrolling and reset the body styles
  const enableScroll = useCallback(() => {
    document.body.style.overflowY = "auto"
    document.body.style.paddingRight = "inherit"
    document.body.style.touchAction = "auto"
    document.body.style.overscrollBehavior = "auto"
  }, [])

  // Effect to enable/disable scroll based on the isScrollDisabled state
  useEffect(() => {
    if (isScrollDisabled) {
      disableScroll()
    } else {
      enableScroll()
    }

    // Cleanup function to enable scroll when component is unmounted or effect re-runs
    return () => {
      enableScroll()
    }
  }, [isScrollDisabled, disableScroll, enableScroll])

  return [setIsScrollDisabled]
}

function NavItem(props) {
  const { isOpen, onToggle, user } = props
  const userBtnRef = useRef(null)
  const [dropdownRight, setDropdownRight] = useState(0)
  const [setIsScrollDisabled] = useScrollControl()
  const [isMounted, setIsMounted] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    setTimeout(() => setInitialLoad(false), 0) // Ensure initialLoad is set to false after the initial render

    if (isOpen) {
      setIsScrollDisabled(true)
      if (userBtnRef.current) {
        const rect = userBtnRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        // Calculate the right position while keeping the dropdown within the viewport
        const rightPosition = viewportWidth - rect.right - 15 // Offset for the additional padding/margin
        setDropdownRight(rightPosition)
        userBtnRef.current.focus()
      }
    } else {
      setIsScrollDisabled(false)
    }
  }, [isOpen, setIsScrollDisabled])

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onToggle()
      userBtnRef.current.focus() // Return focus to the button when closed
    }
  }

  // Prevent the dropdown from being opened by clicking on the backdrop component as it closes
  const handleToggle = useCallback(() => {
    if (isOpen) {
      onToggle()
    }
  }, [isOpen, onToggle])

  return (
    <>
      <Backdrop
        className={initialLoad ? "initial-hidden" : isOpen ? "visible" : ""}
        onClick={handleToggle}
      />
      <StyledUserButton
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        ref={userBtnRef}
        isOpen={isOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`${initialLoad ? "initial-hidden" : ""} ${
          isOpen ? "arrow-icon-visible" : ""
        }`}
      >
        <IconContainer>
          <LiaUserCircleSolid />
        </IconContainer>
        <BtnText>{user ? "Hi, " + user.username : "Sign in"}</BtnText>
        <div className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}>
          <RiArrowDownSLine />
        </div>
      </StyledUserButton>
      {React.cloneElement(props.children, {
        dropdownRight: dropdownRight,
        setOpen: onToggle,
        className: `${
          initialLoad ? "initial-hidden" : isOpen ? "visible" : "invisible"
        }`, // Add the visibility class only after mounted
        user: user,
      })}
    </>
  )
}

function DropdownItem({ children, href, setOpen, onClick, isOpen }) {
  const router = useRouter()

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setOpen(false)
      if (onClick) onClick()
      if (href) router.push(href)
    }
  }

  const handleClick = () => {
    setOpen(false)
    if (onClick) onClick()
    if (href) router.push(href)
  }

  return (
    <MenuItem
      onClick={handleClick}
      role="menuitem"
      tabIndex={isOpen ? 0 : -1} // Make it focusable only if isOpen is true
      onKeyDown={handleKeyDown}
    >
      {children}
    </MenuItem>
  )
}

function DropdownMenu({
  dropdownRight,
  setOpen,
  className,
  handleSignOut,
  user,
  isOpen,
}) {
  const [menuHeight, setMenuHeight] = useState(null)
  const userDropdownRef = useRef(null)

  useEffect(() => {
    if (userDropdownRef.current && userDropdownRef.current.firstChild) {
      setMenuHeight(userDropdownRef.current.firstChild.offsetHeight)
    }
  }, [user])

  function calcHeight(el) {
    const height = el.offsetHeight
    setMenuHeight(height)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <Dropdown
      style={{ height: menuHeight, right: dropdownRight }}
      ref={userDropdownRef}
      role="menu"
      onKeyDown={handleKeyDown}
      className={className} // Apply the visibility class
      isOpen={isOpen}
    >
      <CSSTransition
        in={true}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <Menu>
          {user ? (
            <>
              <ListHeader>Account</ListHeader>
              <DropdownItem href="/profile" setOpen={setOpen} isOpen={isOpen}>
                Profile
              </DropdownItem>
              <DropdownItem href="/orders" setOpen={setOpen} isOpen={isOpen}>
                Orders
              </DropdownItem>
              <DropdownItem href="/wishlist" setOpen={setOpen} isOpen={isOpen}>
                Wishlist
              </DropdownItem>
              <DropdownItem
                href="/account-settings"
                setOpen={setOpen}
                isOpen={isOpen}
              >
                Account Settings
              </DropdownItem>
              <DropdownItem
                onClick={handleSignOut}
                setOpen={setOpen}
                isOpen={isOpen}
              >
                Logout
              </DropdownItem>
            </>
          ) : (
            <>
              <ListHeader>Account</ListHeader>
              <DropdownItem href="/login" setOpen={setOpen} isOpen={isOpen}>
                Sign in
              </DropdownItem>
              <DropdownItem href="/signup" setOpen={setOpen} isOpen={isOpen}>
                Create Account
              </DropdownItem>
              <DropdownItem
                href="/orders" // Need to modify this to lead to the sign-in component then redirect to the orders page
                setOpen={setOpen}
                isOpen={isOpen}
              >
                Orders
              </DropdownItem>
            </>
          )}
        </Menu>
      </CSSTransition>
    </Dropdown>
  )
}

export default UserDropdown
