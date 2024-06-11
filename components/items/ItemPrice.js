import React from "react"
import styled from "styled-components"

const Price = styled.h1`
  font-size: 28px;
  font-weight: 500;
`

const ItemPrice = ({ price }) => {
  return <Price>{price}</Price>
}

export default ItemPrice
