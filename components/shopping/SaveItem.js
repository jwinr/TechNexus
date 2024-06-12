import React, { useState, useContext } from "react"
import styled, { keyframes, css } from "styled-components"
import { GoBookmarkFill } from "react-icons/go"
import { WishlistContext } from "../../context/WishlistContext"
import { filter } from "../../utils/helpers.js"

const Container = styled.div`
  width: 100%;
  height: 44px;
  max-width: 480px;
`

const buttonFilter = filter("button")

const Button = styled(buttonFilter(["isLoading"]))`
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  border-radius: 6px;
  color: var(--sc-color-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  text-align: center;
  background-color: var(--sc-color-blue);
  display: flex;

  &:hover {
    background-color: var(--color-main-dark-blue);
  }

  &:active {
    background-color: var(--color-main-dark-blue);
  }

  &:focus-visible {
    background-color: var(--color-main-dark-blue);
  }

  /* Apply cursor: not-allowed style when loading */
  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: not-allowed !important;
      color: var(--sc-color-button-text-disabled) !important;
      background-color: var(--sc-color-button-disabled) !important;

      &:hover,
      &:active,
      &:focus-visible {
        color: var(--sc-color-button-text-disabled) !important;
        background-color: var(--sc-color-button-disabled) !important;
      }
    `}
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const LoadingSpinner = styled.div`
  width: 25px;
  height: 25px;
  border-color: var(--sc-color-white);
  border-width: 3px;
  border-left-color: var(--sc-color-button-text-disabled);
  border-radius: 40px;
  border-style: solid;
  font-size: 0;
  animation: ${rotate} 2s 0.25s linear infinite;
`

export default function SaveItem({ product }) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToWishlist, removeFromWishlist, wishlist } =
    useContext(WishlistContext)

  const isProductInWishlist = wishlist.some((item) => item.id === product.id)

  const handleClick = () => {
    if (!isLoading) {
      setIsLoading(true)

      setTimeout(() => {
        if (isProductInWishlist) {
          removeFromWishlist(product.id)
        } else {
          addToWishlist(product)
        }
        setIsLoading(false)
      }, 600)
    }
  }

  return (
    <Container>
      <Button
        isLoading={isLoading}
        onClick={handleClick}
        tabIndex={isLoading ? -1 : 0} // Prevent the button from being part of the tab index when it should be disabled
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <GoBookmarkFill size={19} style={{ marginRight: "16px" }} />
            {isProductInWishlist ? "Remove from Wishlist" : "Save for Later"}
          </>
        )}
      </Button>
    </Container>
  )
}
