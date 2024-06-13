import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../context/UserContext"
import styled from "styled-components"
import Link from "next/link"

const WishlistContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
`

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
`

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const RemoveButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #ff3333;
  }
`

const Wishlist = () => {
  const { userAttributes } = useContext(UserContext)
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (userAttributes) {
      fetch(`/api/wishlist?cognitoSub=${userAttributes.sub}`)
        .then((response) => response.json())
        .then((data) => setWishlist(data))
    }
  }, [userAttributes])

  const removeFromWishlist = (productId) => {
    if (userAttributes) {
      fetch(`/api/wishlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cognitoSub: userAttributes.sub,
          productId,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          // Update the wishlist state to reflect the item removal
          setWishlist((currentWishlist) =>
            currentWishlist.filter((item) => item.product_id !== productId)
          )
        })
        .catch((error) => {
          console.error("Error removing item from wishlist:", error)
        })
    }
  }

  return (
    <WishlistContainer>
      <Header>Your Wishlist</Header>
      {wishlist.length === 0 ? (
        <p>
          Your wishlist is empty. <Link href="/">Continue shopping</Link>
        </p>
      ) : (
        wishlist.map((product) => (
          <ProductItem key={product.product_id}>
            <ProductInfo>
              <ProductImage
                src={product.product_image_url}
                alt={product.product_name}
              />
              <ProductDetails>
                <h3>{product.product_name}</h3>
                <p>{product.product_price}</p>
              </ProductDetails>
            </ProductInfo>
            <RemoveButton
              onClick={() => removeFromWishlist(product.product_id)}
            >
              Remove
            </RemoveButton>
          </ProductItem>
        ))
      )}
    </WishlistContainer>
  )
}

export default Wishlist
