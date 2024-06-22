import React, { useState, useEffect, useRef } from "react"
import { RiArrowDownSLine } from "react-icons/ri"
import styled, { keyframes } from "styled-components"
import Checkbox from "../common/Checkbox"
import { useFilters } from "../../context/FilterContext"
import toast from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { useMobileView } from "../../context/MobileViewContext"

const Container = styled.div`
  position: relative;
`

const DropdownButton = styled.button`
  font-size: 15px;
  color: var(--sc-color-text);
  padding: 8px 12px;
  border-radius: 4px;
  position: relative;
  align-items: center;
  display: flex;
  width: 100%;
  border: 1px solid var(--sc-color-border-gray);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-white-highlight);
  }

  &:active {
    background-color: var(--sc-color-white-highlight);
  }

  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
  }
`

const ArrowIcon = styled.div`
  font-size: 18px;
  color: var(--sc-color-text);
  transition: transform 0.3s ease;
`

const DropdownContent = styled.div`
  position: absolute;
  background-color: var(--sc-color-white);
  border: 1px solid #d1d5db;
  border-radius: 8px;
  max-height: 275px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  width: max-content;
  top: 43px;
  z-index: 200;
`

function ProductFilters({ inventoryItems, onFilterChange, attributes }) {
  const { filterState, setFilterState } = useFilters()
  const isMobileView = useMobileView()

  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState({})

  const attributeDropdownRefs = useRef(
    Array(attributes.length).fill(null)
  ).current.map(() => useRef(null))
  const [priceRanges, setPriceRanges] = useState([])

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)
  const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState({})
  const [isSticky, setIsSticky] = useState(false)

  const dropdownPriceRef = useRef(null)

  const togglePriceDropdown = () => {
    setIsPriceDropdownOpen((prevState) => !prevState)
    setIsAttributeDropdownOpen({})
  }

  const handleScroll = () => {
    const offset = window.scrollY
    if (offset > 75) {
      setIsSticky(true)
    } else {
      setIsSticky(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  function handleClickOutside(event) {
    const allDropdownRefs = [dropdownPriceRef, ...attributeDropdownRefs].map(
      (ref) => ref.current
    )

    if (!allDropdownRefs.some((ref) => ref && ref.contains(event.target))) {
      setIsPriceDropdownOpen(false)
      setIsAttributeDropdownOpen({})
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [attributeDropdownRefs])

  useEffect(() => {
    // Calculate unique price ranges
    const uniquePriceRanges = [
      ...new Set(inventoryItems.map((item) => item.price)),
    ]
    setPriceRanges(uniquePriceRanges)
  }, [inventoryItems])

  const predefinedPriceRanges = [
    "$25 - $49.99",
    "$50 - $74.99",
    "$75 - $99.99",
    "$100 - $149.99",
    "$150 - $199.99",
    "$200 - $249.99",
    "$250 - $499.99",
    "$500 - $749.99",
    "$750 - $999.99",
    "$1000 - $1249.99",
    "$1250 - $1499.99",
    "$1500 - $1749.99",
  ]

  const togglePriceRangeSelection = (priceRange) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(priceRange)
        ? prev.filter((pr) => pr !== priceRange)
        : [...prev, priceRange]
    )
    setFilterState((prev) => ({
      ...prev,
      selectedPriceRanges: prev.selectedPriceRanges.includes(priceRange)
        ? prev.selectedPriceRanges.filter((pr) => pr !== priceRange)
        : [...prev.selectedPriceRanges, priceRange],
    }))
  }

  // Toggle the state for a specific attribute dropdown
  const toggleAttributeDropdown = (attributeType) => {
    setIsAttributeDropdownOpen((prevState) => {
      const updatedState = { ...prevState }

      // Close all other dropdowns
      Object.keys(updatedState).forEach((key) => {
        if (key !== attributeType) {
          updatedState[key] = false
        }
      })

      // Toggle the state for the clicked attribute
      updatedState[attributeType] = !updatedState[attributeType]

      return updatedState
    })
  }

  const toggleAttributeSelection = (attributeType, attributeValue) => {
    setFilterState((prev) => ({
      ...prev,
      selectedAttributes: {
        ...prev.selectedAttributes,
        [attributeType]: prev.selectedAttributes[attributeType]?.includes(
          attributeValue
        )
          ? prev.selectedAttributes[attributeType].filter(
              (val) => val !== attributeValue
            )
          : [...(prev.selectedAttributes[attributeType] || []), attributeValue],
      },
    }))
  }

  const isAttributeSelected = (attributeType, attributeValue) =>
    filterState.selectedAttributes[attributeType]?.includes(attributeValue)

  const filterItems = () => {
    let filteredItems = [...inventoryItems]

    // Filter by selected price ranges
    if (filterState.selectedPriceRanges.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        filterState.selectedPriceRanges.some((selectedRange) =>
          isItemInPriceRange(item, selectedRange)
        )
      )
    }

    // Filter items based on selected attributes
    for (const attributeType in filterState.selectedAttributes) {
      const selectedValues = filterState.selectedAttributes[attributeType]
      if (selectedValues.length > 0) {
        filteredItems = filteredItems.filter((item) =>
          item.attributes.some(
            (attribute) =>
              attribute.attribute_type === attributeType &&
              selectedValues.includes(attribute.attribute_value)
          )
        )
      }
    }

    if (filteredItems.length === 0 && inventoryItems.length > 0) {
      // If no items meet the filter criteria, reset the filters
      setFilterState((prev) => ({
        ...prev,
        selectedPriceRanges: [],
        selectedAttributes: {},
      }))
      // And show a message to the user
      toast(
        "We couldn't find any products with those filters. Your filters have been reset.",
        {
          duration: 4000,
          style: { borderLeft: "5px solid #fdc220" },
          icon: (
            <FontAwesomeIcon
              icon={faExclamationCircle}
              style={{
                color: "#fdc220",
                animation:
                  "toastZoom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                animationDelay: "100ms",
              }}
            />
          ),
          position: isMobileView ? "bottom-center" : "bottom-right", // Use 'bottom-center' for mobile view
        }
      )
    } else {
      onFilterChange(filteredItems) // Update the display based on filtered items
    }
  }

  // Listen for changes in filter selections and reapply filters
  useEffect(() => {
    filterItems()
  }, [
    filterState.selectedPriceRanges,
    filterState.selectedAttributes,
    inventoryItems,
  ])

  const isItemInPriceRange = (item, priceRange) => {
    const [minPrice, maxPrice] = priceRange
      .split(" - ")
      .map((value) => parseFloat(value.replace("$", "")))

    return item.price >= minPrice && item.price <= maxPrice
  }

  const availablePriceRanges = predefinedPriceRanges.filter((range) =>
    inventoryItems.some((item) => isItemInPriceRange(item, range))
  )

  // Call filterItems whenever a filter selection happens
  useEffect(() => {
    filterItems()
  }, [selectedPriceRanges, selectedAttributes])

  // Prevent the filter container from disappearing when the user scrolls down
  const containerClass = `brand-filter-container ${isSticky ? "sticky" : ""}`

  useEffect(() => {
    // Close dropdowns when tabbing out of the last checkbox
    const handleTabKey = (event) => {
      if (event.key === "Tab") {
        const allDropdownRefs = [
          dropdownPriceRef,
          ...attributeDropdownRefs,
        ].map((ref) => ref.current)

        allDropdownRefs.forEach((dropdownRef, index) => {
          if (dropdownRef) {
            const focusableElements = dropdownRef.querySelectorAll(
              'input[type="checkbox"], button'
            )
            const lastFocusableElement =
              focusableElements[focusableElements.length - 1]

            if (document.activeElement === lastFocusableElement) {
              if (index === 0) {
                setIsPriceDropdownOpen(false)
              } else {
                const attributeType = attributes[index - 1].attribute_type
                setIsAttributeDropdownOpen((prevState) => ({
                  ...prevState,
                  [attributeType]: false,
                }))
              }
            }
          }
        })
      }
    }

    document.addEventListener("keydown", handleTabKey)
    return () => {
      document.removeEventListener("keydown", handleTabKey)
    }
  }, [attributeDropdownRefs, dropdownPriceRef, attributes])

  return (
    <div className={containerClass}>
      {attributes.map((attribute, index) => (
        <Container
          key={attribute.attribute_type}
          ref={attributeDropdownRefs[index]}
        >
          <DropdownButton
            onClick={() => {
              toggleAttributeDropdown(attribute.attribute_type)
              setIsPriceDropdownOpen(false)
            }}
          >
            <span>{attribute.attribute_type}</span>
            <ArrowIcon>
              {isAttributeDropdownOpen[attribute.attribute_type] ? (
                <RiArrowDownSLine className="rotate-arrow" />
              ) : (
                <RiArrowDownSLine className="arrow-icon-visible" />
              )}
            </ArrowIcon>
          </DropdownButton>
          {isAttributeDropdownOpen[attribute.attribute_type] && (
            <DropdownContent>
              {attribute.attribute_values.map((value, valueIndex) => (
                <Checkbox
                  key={valueIndex}
                  id={`attribute-${attribute.attribute_type}-${value}`}
                  label={value}
                  checked={isAttributeSelected(attribute.attribute_type, value)}
                  onChange={() =>
                    toggleAttributeSelection(attribute.attribute_type, value)
                  }
                />
              ))}
            </DropdownContent>
          )}
        </Container>
      ))}
      <Container ref={dropdownPriceRef}>
        <DropdownButton onClick={togglePriceDropdown}>
          <span>Price</span>
          <ArrowIcon>
            {isPriceDropdownOpen ? (
              <RiArrowDownSLine className="rotate-arrow" />
            ) : (
              <RiArrowDownSLine className="arrow-icon-visible" />
            )}
          </ArrowIcon>
        </DropdownButton>
        {isPriceDropdownOpen && (
          <DropdownContent>
            {availablePriceRanges.map((priceRange, index) => (
              <Checkbox
                key={index}
                id={`price-${priceRange}`}
                label={priceRange}
                checked={selectedPriceRanges.includes(priceRange)}
                onChange={() => togglePriceRangeSelection(priceRange)}
              />
            ))}
          </DropdownContent>
        )}
      </Container>
    </div>
  )
}

export default ProductFilters
