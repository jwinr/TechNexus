import React, { useContext } from "react"
import styled, { keyframes, css } from "styled-components"
import { GoBookmarkFill } from "react-icons/go"
import { UserContext } from "../../context/UserContext"
import LoaderSpin from "../loaders/LoaderSpin"
import PropFilter from "../../utils/PropFilter"
import { LiaBookmark } from "react-icons/lia"

const Container = styled.div`
  position: relative; // Keep the button inside of the product card
  order: 2;
`

const buttonFilter = PropFilter("button")

const Button = styled(buttonFilter(["isLoading"]))`
  padding: 10px;
  border-radius: 50%;
  color: var(--sc-color-text);
  display: flex;
  border: 1px solid var(--sc-color-border-gray);

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

export default function AddToWishlistButton({ productId }) {
  const { userAttributes } = useContext(UserContext)

  const addToWishlist = async () => {
    if (userAttributes) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ cognitoSub: userAttributes.sub, productId }),
      })
    }
  }

  return (
    <Container>
      <Button onClick={addToWishlist}>
        <LiaBookmark aria-hidden="true" />
      </Button>
    </Container>
  )
}
