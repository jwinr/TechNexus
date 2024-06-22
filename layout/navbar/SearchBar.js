import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { IoIosSearch } from "react-icons/io"
import { useRouter } from "next/router"
import Link from "next/link"
import styled from "styled-components"

const InputForm = styled.form`
  display: flex;
  width: 100%;
  align-items: center;
`

const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    display: grid;
    grid-area: nav-search;
  }
`

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    display: flex; /* Take up the full width of the parent container */
  }
`

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 10px;
  outline: none;
  font-size: 15px;
  width: 100%;
  background-color: var(--sc-color-white-highlight);
`

const SubmitButton = styled.button`
  right: 31px;
  position: relative;
  color: var(--sc-color-text);
  width: 35px;
  height: 38px;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 0 8px 8px 0;
  border: 1px transparent;

  @media (max-width: 768px) {
    right: 5px;
    top: 5px;
    position: absolute;
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 18px;

  &:hover {
    color: #003f66;
  }
`

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      clearSearch()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <SearchBarContainer>
      <SearchContainer>
        <InputForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="What can we help you find?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for products"
          />
          <SubmitButton type="submit" aria-label="Submit search">
            <IoIosSearch />
          </SubmitButton>
        </InputForm>
        {searchTerm && (
          <ClearButton onClick={clearSearch} aria-label="Clear search">
            <FontAwesomeIcon icon={faTimes} />
          </ClearButton>
        )}
      </SearchContainer>
    </SearchBarContainer>
  )
}

export default SearchBar