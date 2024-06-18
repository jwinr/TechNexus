import React, { createContext, useContext, useState, useEffect } from "react"

const FilterContext = createContext()

const initialState = {
  currentPage: 1,
  selectedPriceRanges: [],
  selectedAttributes: {},
  filteredItems: [],
  isAttributeDropdownOpen: {},
}

// Load state from sessionStorage
const loadState = () => {
  if (typeof window !== "undefined") {
    const sessionData = sessionStorage.getItem("filterState")
    return sessionData ? JSON.parse(sessionData) : initialState
  }
  return initialState // Default initial state if not in browser
}

export const FilterProvider = ({ children }) => {
  const [filterState, setFilterState] = useState(loadState) // Load state during initial render

  // Store filterState in session storage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("filterState", JSON.stringify(filterState))
    }
  }, [filterState])

  const handleFilterChange = (filteredResults) => {
    setFilterState((prev) => ({ ...prev, filteredItems: filteredResults }))
  }

  return (
    <FilterContext.Provider
      value={{ filterState, setFilterState, handleFilterChange }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilters = () => useContext(FilterContext)
