import React, { useContext, useEffect, useState } from "react"
import { CartContext } from "../context/CartContext"
import styled from "styled-components"

const CartContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
`

const ProductImage = styled.img`
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
`

const Cart = () => {
  const { cart } = useContext(CartContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (cart) {
      setIsLoading(false)
    }
  }, [cart])

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return <p>Your cart is empty.</p>
  }

  return (
    <CartContainer>
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <CartItem key={item.cart_id}>
            <div>
              <ProductImage
                src={item.product_image_url}
                alt={item.product_name}
              />
              <p>{item.product_name}</p>
              <p>{item.product_price}</p>
            </div>
            <div>
              <p>Quantity: {item.quantity}</p>
            </div>
          </CartItem>
        ))}
      </ul>
    </CartContainer>
  )
}

export default Cart
