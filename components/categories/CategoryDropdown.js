import React, { useState, useEffect, useRef } from "react"
import { FiMenu } from "react-icons/fi"
import Link from "next/link"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import styled from "styled-components"
import { StyleSheetManager } from "styled-components"
import { useMobileView } from "../../components/common/MobileViewDetector"
import Backdrop from "../common/Backdrop"

const Dropdown = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    grid-area: nav-cat;
  }
`

const CatPillBtn = styled.button`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: #fff;
  padding-left: 16px;
  padding-right: 8px;
  height: 100%;
  border-radius: 10px;
  position: relative;
  align-items: center;
  display: flex;
  width: 100%;
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

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const CategoryList = styled.div`
  position: absolute;
  top: 65px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  width: 275px;
  display: none;
  z-index: -100;

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

  a {
    width: 100%; // Override to make the full span class clickable
    padding: 10px 0; // And for the height..
  }

  div {
    width: 100%; // Override the div too for the subcategory parent
    cursor: pointer;
    align-items: center;
  }
`

const CategoryItem = styled.span`
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  position: relative;
  font-size: 16px;
  text-decoration: none;
  color: #000;
  width: 100%;

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
  const [isCatOpen, setIsCatOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const isMobileView = useMobileView()
  const [categoriesData, setCategories] = useState([])

  const toggleDropdown = () => {
    setIsCatOpen(!isCatOpen)
  }

  const closeMenu = () => {
    setIsCatOpen(false)
    setSelectedCategory(null) // Clear the selected category when closing the menu
  }

  const goBackToMainCategories = () => {
    setSelectedCategory(null)
  }

  const selectCategory = (category) => {
    const showAllSubcategories = (selectedCategory) => {
      if (
        selectedCategory.subCategories &&
        selectedCategory.subCategories.length > 0
      ) {
        // If the selected category has subcategories, update the state to show only its subcategories
        setSelectedCategory(selectedCategory)
      } else if (selectedCategory.parent_category !== null) {
        // If the selected category has no subcategories and has a parent category,
        // find the parent category and recursively show all its subcategories
        const parentCategory = categoriesData.find(
          (parent) => parent.id === selectedCategory.parent_category
        )
        showAllSubcategories(parentCategory)
      } else {
        // If the selected category has no subcategories and no parent category, close the menu
        closeMenu()
      }
    }

    showAllSubcategories(category)
  }

  let catRef = useRef()

  useEffect(() => {
    let handler = (e) => {
      if (!catRef.current.contains(e.target)) {
        setIsCatOpen(false)
        setSelectedCategory(null) // Clear the selected category when closing the menu
      }
    }

    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [])

  useEffect(() => {
    // Fetch categories data only if it hasn't been fetched before
    if (categoriesData.length === 0) {
      fetch("/api/categories")
        .then((response) => response.json())
        .then((data) => {
          // Filter out categories with a parent_category value (main categories)
          const mainCategories = data.filter(
            (category) => category.parent_category === null
          )

          // Sort main categories by ID before setting the state
          const sortedMainCategories = mainCategories.sort(
            (a, b) => a.id - b.id
          )
          setCategories(sortedMainCategories)
        })
        .catch((error) =>
          console.error("Error fetching category names:", error)
        )
    }
  }, [])

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
    if (isCatOpen) {
      disableScroll()
    } else {
      enableScroll()
    }

    // Cleanup function to enable scroll when component unmounts
    return () => {
      enableScroll()
    }
  }, [isCatOpen])

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "isOpen"}>
      <Dropdown ref={catRef}>
        {isMobileView ? (
          <CatPillBtn isOpen={isCatOpen} onClick={toggleDropdown}>
            <FiMenu />
          </CatPillBtn>
        ) : (
          <CatPillBtn
            isOpen={isCatOpen}
            onClick={toggleDropdown}
            className={isCatOpen ? "arrow-icon-visible" : ""}
          >
            <span>Categories</span>
            <div
              className={`arrow-icon ${isCatOpen ? "rotate-arrow" : ""}`}
              onClick={toggleDropdown}
            >
              <RiArrowDownSLine />
            </div>
          </CatPillBtn>
        )}
        <Backdrop isOpen={isCatOpen} onClick={closeMenu} />
        <CategoryList className={isCatOpen ? "active" : "inactive"}>
          {selectedCategory ? (
            // Display the back button when a subcategory is selected
            // Hardcoded since we only have one subcategory
            <ListHeader onClick={goBackToMainCategories}>
              <div className="left-arrow-icon">
                <RiArrowLeftSLine />
              </div>
              <span style={{ cursor: "pointer" }}>Accessories</span>
            </ListHeader>
          ) : (
            // Display the main categories header when no subcategory is selected
            <ListHeader>All Categories</ListHeader>
          )}
          {selectedCategory
            ? // If a category with subcategories is selected, show only its subcategories
              selectedCategory.subCategories.map((subcategory, index) => (
                <div key={index} onClick={() => selectCategory(subcategory)}>
                  {/* Conditionally render Link or div based on whether there are subcategories */}
                  <CategoryItem>
                    {subcategory.subCategories &&
                    subcategory.subCategories.length > 0 ? (
                      <div style={{ padding: "10px 0" }}>{category.name}</div>
                    ) : (
                      <Link href={`/categories/${subcategory.slug}`}>
                        {subcategory.name}
                      </Link>
                    )}
                  </CategoryItem>
                </div>
              ))
            : // Show main categories when no category with subcategories is selected
              categoriesData.map((category, index) => (
                <div key={index} onClick={() => selectCategory(category)}>
                  {/* Conditionally render Link or div based on whether there are subcategories */}
                  <CategoryItem>
                    {category.subCategories &&
                    category.subCategories.length > 0 ? (
                      <div style={{ padding: "10px 0" }}>{category.name}</div>
                    ) : (
                      <Link href={`/categories/${category.slug}`}>
                        {category.name}
                      </Link>
                    )}
                  </CategoryItem>
                </div>
              ))}
        </CategoryList>
      </Dropdown>
    </StyleSheetManager>
  )
}

export default CategoryDropdown
