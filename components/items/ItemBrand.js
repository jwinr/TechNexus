import React from "react"
import styled from "styled-components"

const Brand = styled.h1`
  font-size: 14px;
  color: rgb(102, 102, 102);
  grid-area: brand;
  display: grid;
`

const ItemBrand = ({ brand }) => {
  return <Brand>{brand}</Brand>
}

export default ItemBrand
