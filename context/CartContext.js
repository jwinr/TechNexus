import React, { createContext, useState, useEffect, useContext } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import { Hub } from "aws-amplify/utils"
import { UserContext } from "./UserContext"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { userAttributes } = useContext(UserContext)

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart?cognitoSub=${userAttributes.sub}`)
      const data = await response.json()
      setCart(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cognitoSub: userAttributes.sub,
          productId,
          quantity,
        }),
      })
      fetchCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cognitoSub: userAttributes.sub,
          productId,
        }),
      })
      fetchCart()
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  useEffect(() => {
    if (userAttributes) {
      fetchCart()
    }
  }, [userAttributes])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}
