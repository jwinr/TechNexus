import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react"
import { UserContext } from "../../context/UserContext"
import styled from "styled-components"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import AccountIcon from "../../public/images/icons/account.svg"
import { CSSTransition } from "react-transition-group"
import Link from "next/link"
import Backdrop from "./Backdrop"
import { signOut } from "aws-amplify/auth"
import PropFilter from "../../utils/PropFilter"
import { useRouter } from "next/router"

const FilteredDiv = PropFilter("div")(["isOpen"])

const Dropdown = styled(FilteredDiv)`
  position: absolute;
  top: 65px;
  width: 275px;
  background-color: var(--sc-color-white);
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

const buttonFilter = PropFilter("button")

const UserButton = buttonFilter(["isOpen"])

const StyledUserButton = styled(UserButton)`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: var(--sc-color-text);
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
  border: 1px transparent;

  &:hover {
    background-color: var(--sc-color-white-highlight);
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
  justify-content: center;
  display: grid;

  svg {
    width: 26px;
  }

  @media (max-width: 768px) {
    width: 28px;
  }
`

const BtnText = styled.div`
  padding: 0 5px;
`

const UserDropdown = ({ isOpen: parentIsOpen, onToggle }) => {
  const { userAttributes } = useContext(UserContext)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {}, [parentIsOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
      localStorage.removeItem("userAttributes") // Remove user attributes from local storage on logout
      router.reload() // Force a page refresh
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Use userAttributes to assign the given_name. If userAttributes is not available, set given_name to null.
  // This is so we can conditionally display “Hi, {user}” if user is available, otherwise display “Sign in”.
  const given_name = userAttributes ? userAttributes.given_name : null

  return (
    <NavItem
      isOpen={isMounted && parentIsOpen}
      onToggle={onToggle}
      user={given_name}
    >
      <DropdownMenu
        isOpen={isMounted && parentIsOpen}
        user={given_name}
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
          <AccountIcon />
        </IconContainer>
        <BtnText>{user ? `Hi, ${user}` : "Sign in"}</BtnText>
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
