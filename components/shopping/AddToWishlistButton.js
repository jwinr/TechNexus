import React, { useContext } from "react"
import styled, { keyframes, css } from "styled-components"
import { GoBookmarkFill } from "react-icons/go"
import { UserContext } from "../../context/UserContext"
import LoaderSpin from "../loaders/LoaderSpin"
import PropFilter from "../../utils/PropFilter"

const Container = styled.div`
  width: 100%;
  height: 44px;
  max-width: 480px;
`

const buttonFilter = PropFilter("button")

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
      <Button onClick={addToWishlist}>Add to Wishlist</Button>
    </Container>
  )
}
