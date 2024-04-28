import React, { useState, useEffect, useRef } from "react"
import { RiArrowDownSLine } from "react-icons/ri"
import styled, { keyframes } from "styled-components"
import Checkbox from "../common/Checkbox"

const Container = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 10px;
`

const DropdownButton = styled.button`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: #fff;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 10px;
  position: relative;
  align-items: center;
  display: flex;
  width: 100%;
  background-color: #00599c;
  transition: background-color 0.2s;

  &:hover {
    background-color: #002d62;
  }

  &:active {
    background-color: #002d62;
  }
`

const ArrowIcon = styled.div`
  font-size: 18px;
  color: #ededed;
  transition: transform 0.3s ease;
`

const DropdownContent = styled.div`
  position: absolute;
  background-color: #ffffff;
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

function ItemFilter({ inventoryItems, onFilterChange, attributes }) {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState({})

  // Creating an array of null values based on the length of attributes
  const attributeDropdownRefs = useRef(Array(attributes.length).fill(null))
    .current // Mapping over the array of null values to create refs
    .map(() => useRef(null))

  const [priceRanges, setPriceRanges] = useState([])

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)
  const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState({})

  const [isSticky, setIsSticky] = useState(false)

  // Ref for the dropdown container to handle clicks outside the dropdown
  const dropdownPriceRef = useRef(null)

  const togglePriceDropdown = () => {
    setIsPriceDropdownOpen((prevState) => !prevState)
    // Close all attribute dropdowns when opening the price dropdown
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

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close the dropdowns when clicking outside
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
    const updatedSelectedPriceRanges = [...selectedPriceRanges]

    if (selectedPriceRanges.includes(priceRange)) {
      updatedSelectedPriceRanges.splice(
        updatedSelectedPriceRanges.indexOf(priceRange),
        1
      )
    } else {
      updatedSelectedPriceRanges.push(priceRange)
    }

    setSelectedPriceRanges(updatedSelectedPriceRanges)
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
    setSelectedAttributes((prevSelectedAttributes) => {
      const updatedSelectedAttributes = { ...prevSelectedAttributes }
      const isSelected =
        updatedSelectedAttributes[attributeType]?.includes(attributeValue)

      updatedSelectedAttributes[attributeType] = isSelected
        ? updatedSelectedAttributes[attributeType].filter(
            (value) => value !== attributeValue
          )
        : [...(updatedSelectedAttributes[attributeType] || []), attributeValue]

      return updatedSelectedAttributes
    })
  }

  const isAttributeSelected = (attributeType, attributeValue) => {
    return (
      selectedAttributes[attributeType] &&
      selectedAttributes[attributeType].includes(attributeValue)
    )
  }

  const filterItems = () => {
    let filteredItems = [...inventoryItems]

    // Filter by selected price ranges
    if (selectedPriceRanges.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedPriceRanges.some((selectedRange) =>
          isItemInPriceRange(item, selectedRange)
        )
      )
    }

    // Filter items based on selected attributes
    for (const attributeType in selectedAttributes) {
      const selectedValues = selectedAttributes[attributeType]
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

    if (filteredItems.length === 0) {
      // If there are no filtered items, reset the filters
      setSelectedPriceRanges([])
      setSelectedAttributes({})
    }

    onFilterChange(filteredItems)
    //console.log("Filtered Items:", filteredItems)
  }

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

  return (
    <div className={containerClass}>
      {attributes.map((attribute, index) => (
        <Container key={index} ref={attributeDropdownRefs[index]}>
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

export default ItemFilter
