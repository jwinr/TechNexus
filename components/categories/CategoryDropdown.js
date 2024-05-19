import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import Link from "next/link"
import Backdrop from "../common/Backdrop"

const Dropdown = styled.div`
  position: absolute;
  top: 65px;
  width: 275px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  overflow: hidden;
  z-index: -100;
  transition: height var(--speed) ease;
  box-sizing: content-box;
  left: ${(props) => props.left}px; // Dynamic left position
`

const CatDropBtn = styled.button`
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
  background-color: ${({ isOpen }) => (isOpen ? "#e0e0e0" : "#f7f7f7")};
  display: flex;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }

  &:focus {
    outline: none;
  }

  &:hover .arrow-icon,
  &.arrow-icon-visible .arrow-icon {
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const Menu = styled.div`
  width: 100%;
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
`

const ListHeader = styled.div`
  margin: 10px 0 15px 0;
  display: flex;
  height: 30px; // Prevent the subcategory button from pushing the text contents down
  font-size: 18px;
  font-weight: 600;
  cursor: text !important;
  width: fit-content !important; // so the headers don't act like a button
`

const ReturnBtn = styled.div`
  -webkit-box-align: center;
  place-items: center;
  border-radius: 4px;
  display: flex;
  margin-right: 8px;
  cursor: pointer;
`

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
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

    fetchCategories()
  }, [])

  return (
    <NavItem>
      <DropdownMenu categories={categories} />
    </NavItem>
  )
}

function NavItem(props) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const [dropdownLeft, setDropdownLeft] = useState(0)

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
    if (open) {
      disableScroll()
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        setDropdownLeft(rect.left)
      }
    } else {
      enableScroll()
    }

    // Cleanup function to enable scroll when component unmounts
    return () => {
      enableScroll()
    }
  }, [open])

  return (
    <>
      <Backdrop isOpen={open} onClick={() => setOpen(!open)} />
      <CatDropBtn
        onClick={() => setOpen(!open)}
        ref={btnRef}
        isOpen={open}
        className={open ? "arrow-icon-visible" : ""} // Keep the button arrow visible when the dropdown is toggled
      >
        <span>Categories</span>
        <div className={`arrow-icon ${open ? "rotate-arrow" : ""}`}>
          <RiArrowDownSLine />
        </div>
      </CatDropBtn>
      {open && React.cloneElement(props.children, { dropdownLeft, setOpen })}
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
}) {
  return hasSubCategories ? (
    <MenuItem onClick={() => goToMenu && setActiveMenu(goToMenu)}>
      {children}
    </MenuItem>
  ) : (
    <Link href={href} passHref>
      <MenuItem onClick={() => setOpen(false)}>{children}</MenuItem>
    </Link>
  )
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

  const mainCategories = categories
  const subCategories = (parentId) => {
    const subs =
      categories.find((category) => category.id === parentId)?.subCategories ||
      []
    return subs
  }

  return (
    <Dropdown
      style={{ height: menuHeight, left: dropdownLeft }}
      ref={dropdownRef}
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
              <ReturnBtn onClick={() => setActiveMenu("main")}>
                <RiArrowLeftSLine size={28} />
              </ReturnBtn>
              {category.name}
            </ListHeader>
            {subCategories(category.id).map((subCategory) => (
              <DropdownItem
                key={subCategory.id}
                href={`/categories/${subCategory.slug}`}
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

export default CategoryDropdown
