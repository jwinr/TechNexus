import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { IoIosSearch } from "react-icons/io"

const ProductSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (event) => {
    const searchText = event.target.value
    setSearchTerm(searchText)

    clearTimeout(handleSearch.timeout)
    handleSearch.timeout = setTimeout(() => {
      // No API request here, just update the URL with the search query
      // The actual search will be performed on the search results page
      // We can pass the query as a query parameter to the results page
      // Example: /search?query=searchTerm
    }, 300)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
  }

  return (
    <div className="product-search-bar">
      <div className="search-container">
        <input
          type="text"
          placeholder="What can we help you find?"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button className="submit-button" aria-label="submit search">
          <Link href={`/search?query=${searchTerm}`}>
            <IoIosSearch />
          </Link>
        </button>
        {searchTerm && (
          <button className="clear-button" onClick={clearSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductSearchBar
