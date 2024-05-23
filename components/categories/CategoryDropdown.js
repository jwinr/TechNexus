import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import { useMobileView } from "../../components/common/MobileViewDetector"
import { FiMenu } from "react-icons/fi"
import Link from "next/link"
import Backdrop from "../common/Backdrop"
import { debounce } from "lodash"

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
  transition: height var(--speed) ease;
  left: ${(props) => props.left}px; // Dynamic left position

  @media (max-width: 768px) {
    left: 0;
  }
`

const CategoryButton = styled.button`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  padding-left: 16px;
  padding-right: 8px;
  height: 100%;
  border-radius: 10px;
  align-items: center;
  width: 100%;
  background-color: ${({ isOpen }) => (isOpen ? "#f7f7f7" : "#fff")};
  display: flex;
  align-items: center;
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
    grid-area: nav-cat;
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

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      console.log("Fetched categories:", data) // Log the fetched categories
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const debouncedFetchCategories = useCallback(
    debounce(fetchCategories, 300),
    []
  )

  useEffect(() => {
    debouncedFetchCategories()
  }, [debouncedFetchCategories])

  return (
    <NavItem>
      <DropdownMenu categories={categories} />
    </NavItem>
  )
}

const useScrollControl = () => {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false)

  const disableScroll = useCallback(() => {
    document.body.style.overflowY = "hidden"
    document.body.style.paddingRight = "15px"
    document.body.style.touchAction = "none"
    document.body.style.overscrollBehavior = "none"
  }, [])

  const enableScroll = useCallback(() => {
    document.body.style.overflowY = "auto"
    document.body.style.paddingRight = "inherit"
    document.body.style.touchAction = "auto"
    document.body.style.overscrollBehavior = "auto"
  }, [])

  useEffect(() => {
    if (isScrollDisabled) {
      disableScroll()
    } else {
      enableScroll()
    }

    return () => {
      enableScroll()
    }
  }, [isScrollDisabled, disableScroll, enableScroll])

  return [setIsScrollDisabled]
}

function NavItem(props) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const [dropdownLeft, setDropdownLeft] = useState(0)
  const [setIsScrollDisabled] = useScrollControl()
  const isMobileView = useMobileView()

  useEffect(() => {
    if (open) {
      setIsScrollDisabled(true)
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        setDropdownLeft(rect.left)
        btnRef.current.focus()
      }
    } else {
      setIsScrollDisabled(false)
    }
  }, [open, setIsScrollDisabled])

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false)
      btnRef.current.focus() // Return focus to the button when closed
    }
  }

  return (
    <>
      <Backdrop isOpen={open} onClick={() => setOpen(!open)} />
      {isMobileView ? (
        <CategoryButton isOpen={!open} onClick={() => setOpen(!open)}>
          <FiMenu />
        </CategoryButton>
      ) : (
        <CategoryButton
          onClick={() => setOpen(!open)}
          onKeyDown={handleKeyDown}
          ref={btnRef}
          isOpen={open}
          aria-haspopup="true"
          aria-expanded={open}
          className={open ? "arrow-icon-visible" : ""} // Keep the button arrow visible when the dropdown is toggled
        >
          <span>Categories</span>
          <div className={`arrow-icon ${open ? "rotate-arrow" : ""}`}>
            <RiArrowDownSLine />
          </div>
        </CategoryButton>
      )}
      {open && React.cloneElement(props.children, { dropdownLeft, setOpen })}
    </>
  )
}

NavItem.propTypes = {
  children: PropTypes.node.isRequired,
}

function DropdownItem({
  children,
  goToMenu,
  hasSubCategories,
  href,
  setActiveMenu,
  setOpen,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (goToMenu) {
        setActiveMenu(goToMenu)
      } else {
        setOpen(false)
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
  ) : (
    <Link href={href} passHref>
      <MenuItem onClick={() => setOpen(false)} role="menuitem">
        {children}
      </MenuItem>
    </Link>
  )
}

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  goToMenu: PropTypes.string,
  hasSubCategories: PropTypes.bool,
  href: PropTypes.string.isRequired,
  setActiveMenu: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
}

DropdownItem.defaultProps = {
  goToMenu: null,
  hasSubCategories: false,
}

function DropdownMenu({ categories, dropdownLeft, setOpen }) {
  const [activeMenu, setActiveMenu] = useState("main")
  const [menuHeight, setMenuHeight] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
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

  const mainCategories = useMemo(() => categories, [categories])
  const getSubCategories = useMemo(
    () => (parentId) => {
      return (
        categories.find((category) => category.id === parentId)
          ?.subCategories || []
      )
    },
    [categories]
  )

  return (
    <Dropdown
      style={{ height: menuHeight, left: dropdownLeft }}
      ref={dropdownRef}
      role="menu"
      onKeyDown={handleKeyDown}
    >
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <Menu>
          <ListHeader>All Categories</ListHeader>
          {mainCategories.map((category) => (
            <DropdownItem
              key={category.id}
              goToMenu={category.subCategories.length > 0 ? category.id : null}
              hasSubCategories={category.subCategories.length > 0}
              href={`/categories/${category.slug}`}
              setActiveMenu={setActiveMenu} // Pass setActiveMenu to DropdownItem
              setOpen={setOpen} // Pass setOpen to DropdownItem
            >
              {category.name}
              {category.subCategories.length > 0 && (
                <RiArrowDownSLine className="arrow-icon" />
              )}
            </DropdownItem>
          ))}
        </Menu>
      </CSSTransition>

      {mainCategories.map((category) => (
        <CSSTransition
          key={category.id}
          in={activeMenu === category.id}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <Menu>
            <ListHeader>
              <ReturnButton
                onClick={() => setActiveMenu("main")}
                role="button"
                tabIndex={0} // Make it focusable
                onKeyDown={(e) => e.key === "Enter" && setActiveMenu("main")}
              >
                <RiArrowLeftSLine size={28} />
              </ReturnButton>
              {category.name}
            </ListHeader>
            {getSubCategories(category.id).map((subCategory) => (
              <DropdownItem
                key={subCategory.id}
                href={`/categories/${subCategory.slug}`}
                setOpen={setOpen}
                setActiveMenu={setActiveMenu} // Pass setActiveMenu to DropdownItem
              >
                {subCategory.name}
              </DropdownItem>
            ))}
          </Menu>
        </CSSTransition>
      ))}
    </Dropdown>
  )
}

DropdownMenu.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      subCategories: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  dropdownLeft: PropTypes.number.isRequired,
  setOpen: PropTypes.func.isRequired,
}

DropdownMenu.defaultProps = {
  dropdownLeft: 0,
}

export default CategoryDropdown
