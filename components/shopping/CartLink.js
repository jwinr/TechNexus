import React, { useState, useEffect, useContext } from "react"
import CartIcon from "../../public/src/images/cart.svg"
import Link from "next/link"
import styled from "styled-components"

const Container = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;

  @media (max-width: 768px) {
    justify-content: flex-end;
    grid-area: nav-cart;
  }
`

const Button = styled.button`
  font-size: 15px;
  cursor: pointer;
  color: var(--sc-color-text);
  padding: 7px 10px;
  border-radius: 10px;
  position: relative;
  align-items: center;
  display: flex;
  width: fit-content;
  justify-content: flex-end;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-white-highlight);
  }
`

const CartCircle = styled.div`
  position: absolute;
  top: 0px;
  right: -1px;
  background-color: var(--sc-color-text);
  color: var(--sc-color-white);
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 10px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  justify-content: center;
  display: grid;

  svg {
    width: 24px;
  }

  @media (max-width: 768px) {
    width: 26px;
  }
`

function CartLink() {
  const numberOfItemsInCart = 0
  // const { numberOfItemsInCart = 0 } = useContext(SiteContext) (old method)

  // Dynamically change the label based on 1 or more items
  const ariaLabel = `Cart, ${numberOfItemsInCart} ${
    numberOfItemsInCart === 1 ? "item" : "items"
  }`

  return (
    <Container href="/cart" tabIndex="-1" aria-label={ariaLabel}>
      <Button aria-label={ariaLabel}>
        <Wrapper>
          <CartIcon />
        </Wrapper>
      </Button>
      <CartCircle>{numberOfItemsInCart}</CartCircle>
    </Container>
  )
}

export default CartLink
