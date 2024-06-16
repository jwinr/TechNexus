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
