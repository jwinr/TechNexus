import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import { CartContext } from "../context/CartContext"
import { useRouter } from "next/router"
import styled from "styled-components"
import LoaderDots from "../components/common/LoaderDots"
import { BsCartX } from "react-icons/bs"

const PageWrapper = styled.div`
  margin: 0px auto;
  max-width: 1400px;
`

const CartContainer = styled.div`
  margin: 16px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px, rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
`

const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 50px 0;
  margin: 50px auto;
`

const RedirectButton = styled.button`
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--sc-color-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  max-width: 300px;
  width: 100%;
  text-align: center;
  background-color: var(--sc-color-blue);
  transition: background-color 0.3s;
  margin-top: 16px;
  margin-bottom: 16px;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:active {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
  }
`

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`

const EmptyHeader = styled.h1`
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 8px;
`

const CartItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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

const Cart = () => {
  const { userAttributes } = useContext(UserContext)
  const { cart, setCart } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/cart?cognitoSub=${userAttributes?.sub}`
        )
        const data = await response.json()
        setCart(data)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userAttributes) {
      fetchCart()
    }
  }, [userAttributes, setCart])

  const removeFromCart = async (productId) => {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cognitoSub: userAttributes.sub, productId }),
      })

      // Update cart state after removal
      setCart((prevCart) =>
        prevCart.filter((item) => item.product_id !== productId)
      )
    } catch (error) {
      console.error("Error removing product from cart:", error)
    }
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  const handleHomePage = () => {
    router.push("/")
  }

  if (loading) {
    return <LoaderDots />
  }

  // If the cart is empty..
  if (!cart || cart.length === 0) {
    return (
      <>
        <PageWrapper>
          <CartContainer>
            <EmptyCartContainer>
              <EmptyHeader>Your cart is empty</EmptyHeader>
              {userAttributes ? (
                <>
                  <span>Check out what we're featuring now!</span>
                  <RedirectButton onClick={handleHomePage} type="button">
                    Go to homepage
                  </RedirectButton>
                </>
              ) : (
                <>
                  <span>Have an account? Sign in to see your cart</span>
                  <RedirectButton onClick={handleSignIn} type="button">
                    Sign in
                  </RedirectButton>
                </>
              )}
              <BsCartX size={200} />
            </EmptyCartContainer>
          </CartContainer>
        </PageWrapper>
      </>
    )
  }

  return (
    <PageWrapper>
      <CartContainer>
        <Header>Your Cart</Header>
        <ul>
          {cart.map((item) => (
            <CartItem key={item.product_id}>
              <div>
                <p>{item.product_name}</p>
                <p>${item.product_price}</p>
              </div>
              <img
                src={item.product_image_url}
                alt={item.product_name}
                style={{ width: "50px" }}
              />
              <RemoveButton onClick={() => removeFromCart(item.product_id)}>
                Remove
              </RemoveButton>
            </CartItem>
          ))}
        </ul>
      </CartContainer>
    </PageWrapper>
  )
}

export default Cart
