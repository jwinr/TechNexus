import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { IoIosSearch } from "react-icons/io"
import { useRouter } from "next/router"
import Link from "next/link"
import styled from "styled-components"

const InputForm = styled.form`
  display: flex;
  width: 100%;
`

const SearchBar = styled.div`
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
  align-items: center;
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    display: flex; /* Take up the full width of the parent container */
  }
`

const SearchInput = styled.input`
  padding: 8px;
  border-radius: 10px;
  outline: none;
  font-size: 15px;
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;
`

const SubmitButton = styled.button`
  right: 31px;
  position: relative;
  color: #333;
  width: 35px;
  height: 38px;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 0 8px 8px 0;

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

const ProductSearchBar = () => {
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

  return (
    <SearchBar>
      <SearchContainer>
        <InputForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="What can we help you find?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SubmitButton type="submit" aria-label="submit search">
            <IoIosSearch />
          </SubmitButton>
        </InputForm>
        {searchTerm && (
          <ClearButton onClick={clearSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </ClearButton>
        )}
      </SearchContainer>
    </SearchBar>
  )
}

export default ProductSearchBar
