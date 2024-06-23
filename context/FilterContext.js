import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react"
import { useRouter } from "next/router"

const FilterContext = createContext()

const initialState = {
  currentPage: 1,
  selectedPriceRanges: [],
  selectedAttributes: {},
  filteredItems: [],
  isAttributeDropdownOpen: {},
}

// Load state from sessionStorage
const loadState = (slug) => {
  if (typeof window !== "undefined") {
    const sessionData = sessionStorage.getItem(`filterState_${slug}`)
    return sessionData ? JSON.parse(sessionData) : initialState
  }
  return initialState // Default initial state if not in browser
}

export const FilterProvider = ({ children }) => {
  const router = useRouter()
  const { slug } = router.query
  const prevSlugRef = useRef(slug)

  // Load initial state from session storage
  const [filterState, setFilterState] = useState(() => loadState(slug))

  // Update state and session storage whenever filterState or slug changes
  useEffect(() => {
    if (slug) {
      const savedState = loadState(slug)
      setFilterState(savedState)
    }
  }, [slug])

  useEffect(() => {
    if (slug) {
      sessionStorage.setItem(`filterState_${slug}`, JSON.stringify(filterState))
    }
  }, [filterState, slug])

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
