import React from "react"
import styled from "styled-components"

const Title = styled.h1`
  font-size: 16px;
  font-weight: 800;
  color: rgb(51, 51, 51);
`

const ItemTitle = ({ title }) => {
  return <Title>{title}</Title>
}

export default ItemTitle
