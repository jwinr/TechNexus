import React, { useState, useEffect, useContext } from "react"
import { LiaShoppingCartSolid } from "react-icons/lia"
import Link from "next/link"
import styled from "styled-components"
import { SiteContext } from "../../context/mainContext"

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
  color: #333;
  padding: 7px 10px;
  border-radius: 10px;
  position: relative;
  align-items: center;
  display: flex;
  width: fit-content;
  justify-content: flex-end;
  transition: background-color 0.2s;
  border: 1px dashed transparent;

  &:focus {
    border: 1px dashed rgb(51, 51, 51);
    outline: none;
  }

  &:hover {
    background-color: #f7f7f7;
  }
`

const CartCircle = styled.div`
  position: absolute;
  top: 0px;
  right: -1px;
  background-color: #333;
  color: #fff;
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
  font-size: 26px;
  justify-content: center;
  display: grid;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

function CartLink() {
  const { numberOfItemsInCart = 0 } = useContext(SiteContext)

  // Dynamically change the label based on 1 or more items
  const ariaLabel = `Cart, ${numberOfItemsInCart} ${
    numberOfItemsInCart === 1 ? "item" : "items"
  }`

  return (
    <Container href="/cart" tabindex="-1" aria-label={ariaLabel}>
      <Button aria-label={ariaLabel}>
        <Wrapper>
          <LiaShoppingCartSolid />
        </Wrapper>
      </Button>
      <CartCircle>{numberOfItemsInCart}</CartCircle>
    </Container>
  )
}

export default CartLink
