import React from "react"
import styled from "styled-components"

const CategorizedItemsContainer = styled.div`
  display: grid;
  grid-area: items;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 35px;
  padding: 5px 75px 0px 75px;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  z-index: 100;
`

function CategorizedItems({ children, isVisible }) {
  return (
    <CategorizedItemsContainer isVisible={isVisible}>
      {children}
    </CategorizedItemsContainer>
  )
}

export default CategorizedItems
