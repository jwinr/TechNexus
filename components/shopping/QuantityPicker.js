// QuantityPicker.js
import React from "react"
import styled from "styled-components"

const QuantityPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-right: 15px;
`

const QuantityLabel = styled.span`
  margin-right: 10px;
`

const QuantitySelect = styled.select`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
`

const QuantityButton = styled.button`
  margin-left: 5px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #4fbbff;
  color: var(--sc-color-white);
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: #3578e5;
  }
`

const QuantityPicker = ({ quantity, onQuantityChange }) => {
  return (
    <QuantityPickerWrapper>
      <QuantityLabel>Quantity:</QuantityLabel>
      <QuantitySelect
        value={quantity}
        onChange={(e) => onQuantityChange(Number(e.target.value))}
      >
        {[...Array(10).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </QuantitySelect>
    </QuantityPickerWrapper>
  )
}

export default QuantityPicker
