import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import Link from "next/link"

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

  .arrow-icon {
    margin-left: auto;
    opacity: 0.6;
    transition: opacity 0.3s;
  }

  &:hover .arrow-icon {
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
  padding: 0.5rem;
  text-decoration: none;

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
  cursor: text !important; // Override the styles from the CategoryList,
  width: fit-content !important; // so the headers don't act like a button
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

  return (
    <>
      <CatDropBtn onClick={() => setOpen(!open)}>
        <span>Categories</span>
        <div className={`arrow-icon ${open ? "rotate-arrow" : ""}`}>
          <RiArrowDownSLine />
        </div>
      </CatDropBtn>
      {open && props.children}
    </>
  )
}

function DropdownItem({
  children,
  goToMenu,
  hasSubCategories,
  href,
  setActiveMenu,
}) {
  return hasSubCategories ? (
    <MenuItem onClick={() => goToMenu && setActiveMenu(goToMenu)}>
      {children}
    </MenuItem>
  ) : (
    <Link href={href} passHref>
      <MenuItem>{children}</MenuItem>
    </Link>
  )
}

function DropdownMenu({ categories }) {
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
    <Dropdown style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <Menu>
          <ListHeader>Categories</ListHeader>
          {mainCategories.map((category) => (
            <DropdownItem
              key={category.id}
              goToMenu={category.subCategories.length > 0 ? category.id : null}
              hasSubCategories={category.subCategories.length > 0}
              href={`/${category.slug}`}
              setActiveMenu={setActiveMenu} // Pass setActiveMenu to DropdownItem
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
            <ListHeader onClick={() => setActiveMenu("main")}>
              <RiArrowLeftSLine />
              {category.name}
            </ListHeader>
            {subCategories(category.id).map((subCategory) => (
              <DropdownItem key={subCategory.id} href={`/${subCategory.slug}`}>
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
