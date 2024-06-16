import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react"
import { UserContext } from "./UserContext"
import toast from "react-hot-toast"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { userAttributes } = useContext(UserContext)

  const fetchProductDetails = async (cartItems) => {
    try {
      const productIds = cartItems.map((item) => item.product_id)
      const response = await fetch(
        `/api/cart?productIds=${productIds.join(",")}`
      )
      const products = await response.json()
      return cartItems.map((item) => ({
        ...item,
        ...products.find((product) => product.product_id === item.product_id),
      }))
    } catch (error) {
      console.error("Error fetching product details:", error)
      return cartItems
    }
  }

  const fetchCart = async () => {
    if (userAttributes) {
      try {
        const response = await fetch(
          `/api/cart?cognitoSub=${userAttributes.sub}`
        )
        const data = await response.json()
        const detailedCart = await fetchProductDetails(data)
        setCart(detailedCart)
      } catch (error) {
        console.error("Error fetching cart:", error)
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || []
      if (localCart.length > 0) {
        const detailedCart = await fetchProductDetails(localCart)
        setCart(detailedCart)
      }
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (userAttributes) {
      try {
        const existingItem = cart.find((item) => item.product_id === productId)
        const newQuantity = existingItem
          ? existingItem.quantity + quantity
          : quantity

        if (newQuantity > 10) {
          toast.error("Sorry, you've reached the limit for this product.", {
            position: "bottom-right",
          })
          return
        }

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
        toast.success("Added to cart!", {
          position: "bottom-right",
        })
      } catch (error) {
        console.error("Error adding to cart:", error)
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || []
      const existingItem = localCart.find(
        (item) => item.product_id === productId
      )

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > 10) {
          toast.error("Sorry, you've reached the limit for this product.", {
            position: "bottom-right",
          })
          return
        }
        existingItem.quantity = newQuantity
      } else {
        if (quantity > 10) {
          toast.error("Sorry, you've reached the limit for this product.", {
            position: "bottom-right",
          })
          return
        }
        localCart.push({ product_id: productId, quantity })
      }

      localStorage.setItem("cart", JSON.stringify(localCart))
      fetchCart() // Fetch the updated cart with product details
    }
  }

  const removeFromCart = async (productId) => {
    if (userAttributes) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cognitoSub: userAttributes.sub, productId }),
        })
        fetchCart()
      } catch (error) {
        console.error("Error removing product from cart:", error)
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || []
      const updatedCart = localCart.filter(
        (item) => item.product_id !== productId
      )
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      fetchCart() // Fetch the updated cart with product details
    }
  }

  const syncLocalCartWithServer = async () => {
    if (userAttributes) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || []
      await Promise.all(
        localCart.map((item) => addToCart(item.product_id, item.quantity))
      )
      localStorage.removeItem("cart")
    }
  }

  useEffect(() => {
    fetchCart()
  }, [userAttributes])

  useEffect(() => {
    syncLocalCartWithServer()
  }, [userAttributes])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}
