import React, { useState, useEffect, createContext, useContext } from "react"
import toast from "react-hot-toast"

const STORAGE_KEY = "NEXT_TECHNEXUS_"

const initialState = {
  cart: [],
  numberOfItemsInCart: 0,
  total: 0,
}

const SiteContext = createContext()

const ContextProviderComponent = ({ children }) => {
  const [cartState, setCartState] = useState(initialState)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageState = window.localStorage.getItem(STORAGE_KEY)

      if (storageState) {
        setCartState(JSON.parse(storageState))
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
      }
    }
  }, [])

  const updateCartState = (newCart) => {
    setCartState({
      cart: newCart,
      numberOfItemsInCart: newCart.length,
      total: calculateTotal(newCart),
    })
  }

  const calculateTotal = (cart) => {
    return cart.reduce((acc, next) => {
      const quantity = next.quantity
      const price = next.price

      if (price !== undefined) {
        try {
          const parsedPrice = JSON.parse(price)
          if (!isNaN(parsedPrice)) {
            acc += parsedPrice * quantity
          }
        } catch (error) {
          console.error(`Error parsing price for item ${next.id}: ${error}`)
        }
      }

      return acc
    }, 0)
  }

  const setItemQuantity = (item) => {
    const { cart } = cartState
    const index = cart.findIndex((cartItem) => cartItem.id === item.id)
    cart[index].quantity = item.quantity

    updateCartState(cart)
  }

  const addToCart = (item) => {
    console.log("cart:", cart)
    console.log("item:", item)

    const { cart } = cartState
    if (cart.length) {
      const index = cart.findIndex((cartItem) => cartItem.id === item.id)
      if (index >= 0) {
        cart[index].quantity = cart[index].quantity + item.quantity
      } else {
        cart.push(item)
      }
    } else {
      cart.push(item)
    }

    updateCartState(cart)
    toast.success("Added to cart!", {
      position: "bottom-right",
    })

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState))
  }

  const removeFromCart = (item) => {
    setCartState((prevState) => {
      // Filter out the item from the cart
      const updatedCart = prevState.cart.filter((c) => c.id !== item.id)

      // Calculate the total with the updated cart
      const updatedTotal = calculateTotal(updatedCart)

      // Update localStorage with the latest cart state
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...prevState,
          cart: updatedCart,
          numberOfItemsInCart: updatedCart.length,
          total: updatedTotal,
        })
      )

      // Return the updated state
      return {
        ...prevState,
        cart: updatedCart,
        numberOfItemsInCart: updatedCart.length,
        total: updatedTotal,
      }
    })
  }

  const clearCart = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
    setCartState(initialState)
  }

  return (
    <SiteContext.Provider
      value={{
        ...cartState,
        addToCart,
        clearCart,
        removeFromCart,
        setItemQuantity,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

const useSiteContext = () => {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error("useSiteContext must be used within a SiteContextProvider")
  }
  return context
}

export { SiteContext, ContextProviderComponent, useSiteContext }
