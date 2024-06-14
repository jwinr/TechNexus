// /components/shopping/AddToWishListButton.js

import React, { useState, useContext } from "react"
import styled, { css, keyframes } from "styled-components"
import { GoBookmarkFill } from "react-icons/go"
import { UserContext } from "../../context/UserContext"
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

export default function AddToWishlistButton({ product }) {
  const { userAttributes } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)

  const addToWishlist = async () => {
    if (userAttributes) {
      setIsLoading(true)
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cognitoSub: userAttributes.sub,
          productId: product.id,
        }),
      })
      setIsLoading(false)
      if (!response.ok) {
        console.error("Error adding to wishlist:", await response.text())
      }
    }
  }

  return (
    <Container>
      <Button onClick={addToWishlist} isLoading={isLoading}>
        {isLoading ? <LoadingSpinner /> : <GoBookmarkFill />}
      </Button>
    </Container>
  )
}
