import React, { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { CartContext } from "../../context/CartContext"
import styled from "styled-components"

const Button = styled.button`
  background-color: var(--sc-color-blue);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }
`

const AddToCartButton = ({ productId, quantity = 1 }) => {
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = async () => {
    await addToCart(productId, quantity)
  }

  return <Button onClick={handleAddToCart}>Add to Cart</Button>
}

export default AddToCartButton
