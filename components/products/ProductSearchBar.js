import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { IoIosSearch } from "react-icons/io"
import Link from "next/link"
import Backdrop from "../common/Backdrop"

const ProductSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(`/api/search?query=${query}`)
      const data = await response.json()
      if (response.ok) {
        setSearchResults(data.products)
      } else {
        console.error(data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error fetching search results:", error)
      setSearchResults([])
    }
  }

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchSearchResults(searchTerm)
      setIsBackdropOpen(true)
    } else {
      setSearchResults([])
      setIsBackdropOpen(false)
    }
  }, [searchTerm])

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
    setIsBackdropOpen(false)
  }

  return (
    <>
      <Backdrop isOpen={isBackdropOpen} onClick={clearSearch} />

      <div className="product-search-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="What can we help you find?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            onFocus={() => setIsBackdropOpen(true)}
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
        {searchResults.length > 0 && (
          <div className="search-results">
            <ul>
              {searchResults.map((product) => (
                <li key={product.product_id}>
                  <Link href={`/product/${product.slug}`}>
                    {product.images.length > 0 && (
                      <img
                        src={
                          product.images.find((img) => img.is_main)
                            ?.image_url || product.images[0].image_url
                        }
                        alt={product.name}
                        width="50"
                        height="50"
                      />
                    )}
                    <span>{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default ProductSearchBar
