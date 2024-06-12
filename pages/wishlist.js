import React, { useContext } from "react"
import { WishlistContext } from "../context/WishlistContext"
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
  const { wishlist, removeFromWishlist } = useContext(WishlistContext)

  return (
    <WishlistContainer>
      <Header>Your Wishlist</Header>
      {wishlist.length === 0 ? (
        <p>
          Your wishlist is empty. <Link href="/">Continue shopping</Link>
        </p>
      ) : (
        wishlist.map((product) => (
          <ProductItem key={product.id}>
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <RemoveButton onClick={() => removeFromWishlist(product.id)}>
              Remove
            </RemoveButton>
          </ProductItem>
        ))
      )}
    </WishlistContainer>
  )
}

export default Wishlist
