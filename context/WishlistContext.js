import React, { createContext, useState, useEffect } from "react"

export const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    // Load wishlist from local storage on initial load to prevent unnecessary API calls
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist))
    }
  }, [])

  useEffect(() => {
    // Save wishlist to local storage whenever it changes
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product])
  }

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    )
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
