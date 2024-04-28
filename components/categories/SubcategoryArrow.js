import React from "react"
import { RiArrowDownSLine } from "react-icons/ri"
import styled from "styled-components"

const StyledSubcategoryArrow = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  cursor: pointer;
  transition: transform 0.3s ease;

  &.open {
    transform: rotate(180deg);
  }
`

const SubcategoryArrow = ({ isOpen }) => (
  <StyledSubcategoryArrow className={isOpen ? "open" : ""}>
    <RiArrowDownSLine />
  </StyledSubcategoryArrow>
)

export default SubcategoryArrow
