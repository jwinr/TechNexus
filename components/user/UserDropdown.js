import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import Link from "next/link"
import Backdrop from "../common/Backdrop"
import { debounce } from "lodash"
import { Auth } from "aws-amplify"
import { signOut } from "aws-amplify/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPen } from "@fortawesome/free-solid-svg-icons"
import { LiaHeart } from "react-icons/lia"
import { LiaUser } from "react-icons/lia"
import { CiViewList } from "react-icons/ci"
import { IoIosLogOut } from "react-icons/io"
import { HiOutlineCog8Tooth } from "react-icons/hi2"

import { LiaUserCircleSolid } from "react-icons/lia"

import { filter } from "../../utils/helpers.js"

const Dropdown = styled.div`
  position: absolute;
  top: 65px;
  width: 275px;
  background-color: #fff;
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
    visibility: visible;
    transform: translateY(0); // Slide it into place
  }

  &.invisible {
    transform: translateY(-1000px);
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
  color: #333;
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
    background-color: #f7f7f7;
  }

  &:focus {
    border: 1px dashed rgb(51, 51, 51);
    outline: none;
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
`

const Menu = styled.div`
  width: 100%;

  & a:focus {
    text-decoration: underline;
    outline: none;
  }
`

const MenuItem = styled.span`
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

const ReturnButton = styled.div`
  -webkit-box-align: center;
  place-items: center;
  border-radius: 4px;
  display: flex;
  margin-right: 8px;
  cursor: pointer;
  border: 1px dashed transparent;

  &:focus {
    border: 1px dashed rgb(51, 51, 51);
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

const UserDropdown = ({ isOpen, onToggle }) => {
  const [user, setUser] = useState(null)

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

  const handleSignOut = async () => {
    await signOut()
  }

  const userName = user
    ? `${user.attributes.given_name} ${user.attributes.family_name}`
    : "Returning customer?"

  return (
    <NavItem isOpen={isOpen} onToggle={onToggle}>
      <DropdownMenu user={user} handleSignOut={handleSignOut} />
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
  const { isOpen, onToggle } = props
  const [open, setOpen] = useState(false)
  const userBtnRef = useRef(null)
  const [dropdownRight, setDropdownRight] = useState(0)
  const [setIsScrollDisabled] = useScrollControl()

  useEffect(() => {
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

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onToggle} />
      <StyledUserButton
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        ref={userBtnRef}
        isOpen={isOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={isOpen ? "arrow-icon-visible" : ""} // Keep the button arrow visible when the dropdown is toggled
      >
        <IconContainer>
          <LiaUserCircleSolid />
        </IconContainer>
        <span>Account</span>
        <div className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}>
          <RiArrowDownSLine />
        </div>
      </StyledUserButton>
      {React.cloneElement(props.children, {
        dropdownRight: dropdownRight,
        setOpen: onToggle,
        className: isOpen ? "visible" : "invisible", // Add the visibility class
      })}
    </>
  )
}

function DropdownItem({
  children,
  goToMenu,
  hasSubCategories,
  href,
  setActiveMenu,
  setOpen,
  onClick,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (goToMenu) {
        setActiveMenu(goToMenu)
      } else {
        setOpen(false)
        if (onClick) onClick()
      }
    }
  }

  return hasSubCategories ? (
    <MenuItem
      onClick={() => goToMenu && setActiveMenu(goToMenu)}
      role="menuitem"
      tabIndex={0} // Make the subcategory focusable via the tab key
      onKeyDown={handleKeyDown}
    >
      {children}
    </MenuItem>
  ) : href ? (
    <Link href={href} passHref>
      <MenuItem onClick={() => setOpen(false)} role="menuitem">
        {children}
      </MenuItem>
    </Link>
  ) : (
    <MenuItem
      onClick={() => {
        setOpen(false)
        if (onClick) onClick()
      }}
      role="menuitem"
    >
      {children}
    </MenuItem>
  )
}

function DropdownMenu({ dropdownRight, setOpen, className, handleSignOut }) {
  const [activeMenu, setActiveMenu] = useState("main")
  const [menuHeight, setMenuHeight] = useState(null)
  const userDropdownRef = useRef(null)

  useEffect(() => {
    setMenuHeight(userDropdownRef.current?.firstChild.offsetHeight)
  }, [])

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
    >
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <Menu>
          <ListHeader>User Menu</ListHeader>
          <DropdownItem
            href="/orders"
            setActiveMenu={setActiveMenu}
            setOpen={setOpen}
          >
            <CiViewList />
            Orders
          </DropdownItem>
          <DropdownItem
            href="/wishlist"
            setActiveMenu={setActiveMenu}
            setOpen={setOpen}
          >
            <LiaHeart />
            Wishlist
          </DropdownItem>
          <DropdownItem
            href="/profile"
            setActiveMenu={setActiveMenu}
            setOpen={setOpen}
          >
            <LiaUser />
            Profile
          </DropdownItem>
          <DropdownItem
            href="/account-settings"
            setActiveMenu={setActiveMenu}
            setOpen={setOpen}
          >
            <HiOutlineCog8Tooth />
            Account Settings
          </DropdownItem>
          <DropdownItem
            onClick={handleSignOut}
            setActiveMenu={setActiveMenu}
            setOpen={setOpen}
          >
            <IoIosLogOut />
            Logout
          </DropdownItem>
        </Menu>
      </CSSTransition>
    </Dropdown>
  )
}

export default UserDropdown
