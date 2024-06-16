import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import { CartContext } from "../context/CartContext"
import { useRouter } from "next/router"
import styled from "styled-components"
import LoaderDots from "../components/common/LoaderDots"
import { BsCartX } from "react-icons/bs"
import { VscClose } from "react-icons/vsc"
import QuantityPicker from "../components/shopping/QuantityPicker"
import Image from "next/image"
import Link from "next/link"

const PageWrapper = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-flow: wrap;
`

const ProductCard = styled.li`
  display: flex;
  flex: 0 1 auto;
  flex-flow: row;
  padding: 16px;
  width: 100%;
`

const ImageWrapper = styled.div`
  width: 80px;
  flex: 0 0 auto;
  padding-right: 0px;
  padding-left: 0px;

  img {
    height: auto;
  }
`

const PriceWrapper = styled.div`
  display: flex;
  -webkit-box-align: baseline;
  align-items: baseline;

  p {
    font-weight: bold;
    font-size: 19px;
  }
`

const DetailsWrapper = styled.div`
  width: 100%;
  flex: 0 0 auto;
  min-width: 0px;
  padding-left: 12px;

  @media (min-width: 0) {
    flex-shrink: 1;
  }
`

const QuantityWrapper = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-flow: wrap;
  margin: 12px 0;
`

const RemoveButtonWrapper = styled.div`
  position: relative; // Keep the button inside of the product card
`

const RemoveButton = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const OrderSummaryContainer = styled.div`
  padding: 24px 16px;
  flex: 1 1 auto;

  @media (min-width: 992px) {
    margin-left: 16px;
  }

  @media (max-width: 600px) {
    width: 100%;
    margin-left: 0;
    margin-top: 24px;
  }
`

const CartContainer = styled.div`
  margin: 16px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px, rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
  margin-top: 16px;
`

const CartWrapper = styled.div`
  @media (min-width: 0) {
    margin-left: initial;
    flex-basis: 100%;
    max-width: 100%;
  }

  @media (min-width: 992px) {
    margin-left: initial;
    flex-basis: 75%;
    max-width: 75%;
  }
`

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const EmptyCartContainer = styled.div`
  margin: 16px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px, rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
  width: 100%;
`

const EmptyCart = styled.div`
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
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-left: 16px;
`

const EmptyHeader = styled.h1`
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 8px;
`

const TitleWrapper = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  min-height: 49px;
  width: 100%;
  margin-left: 4px;
  margin-top: 24px;
`

const Cart = () => {
  const { userAttributes } = useContext(UserContext)
  const { cart, setCart } = useContext(CartContext)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      if (userAttributes === null) {
        console.log("User attributes are null, skipping fetch")
        setLoading(false)
        return
      }

      console.log("Fetching cart for userAttributes:", userAttributes)

      try {
        if (userAttributes) {
          const response = await fetch(
            `/api/cart?cognitoSub=${userAttributes.sub}`
          )
          const data = await response.json()
          console.log("Cart data fetched from server:", data)
          setCart(
            data.map((item) => ({ ...item, quantity: item.quantity || 1 }))
          )
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart")) || []
          if (localCart.length > 0) {
            const productIds = localCart
              .map((item) => item.product_id)
              .join(",")
            const response = await fetch(`/api/cart?productIds=${productIds}`)
            const data = await response.json()
            console.log("Cart data fetched from local storage:", data)
            const detailedCart = localCart.map((item) => ({
              ...item,
              ...data.find((product) => product.product_id === item.product_id),
              quantity: item.quantity,
            }))
            setCart(detailedCart)
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [userAttributes, setCart])

  const removeFromCart = async (productId) => {
    try {
      console.log("Removing product from cart with ID:", productId)
      if (userAttributes) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cognitoSub: userAttributes.sub, productId }),
        })
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || []
        const updatedCart = localCart.filter(
          (item) => item.product_id !== productId
        )
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        setCart(updatedCart)
      }

      setCart((prevCart) =>
        prevCart.filter((item) => item.product_id !== productId)
      )
      console.log("Product removed from cart. Updated cart:", cart)
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

  const calculateTotal = () => {
    console.log("Calculating totals for cart:", cart)
    const cartWithQuantities = cart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }))
    const subtotal = cartWithQuantities.reduce(
      (sum, item) => sum + Number(item.product_price) * Number(item.quantity),
      0
    )
    const freeShipping = 0
    const estimatedTaxes = subtotal * 0.07
    const total = subtotal + freeShipping + estimatedTaxes

    console.log(
      "Subtotal:",
      subtotal,
      "Estimated Taxes:",
      estimatedTaxes,
      "Total:",
      total
    )

    return {
      subtotal: subtotal.toFixed(2),
      freeShipping: freeShipping.toFixed(2),
      estimatedTaxes: estimatedTaxes.toFixed(2),
      total: total.toFixed(2),
    }
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      console.log(
        "Updating quantity for product ID:",
        productId,
        "to new quantity:",
        newQuantity
      )
      if (userAttributes) {
        await fetch("/api/cart", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cognitoSub: userAttributes.sub,
            productId,
            quantity: newQuantity,
          }),
        })
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || []
        const updatedCart = localCart.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        setCart(updatedCart)
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
      console.log("Updated cart after quantity change:", cart)
    } catch (error) {
      console.error("Error updating product quantity:", error)
    }
  }

  if (loading) {
    return <LoaderDots />
  }

  if (!cart || cart.length === 0) {
    return (
      <PageWrapper>
        <EmptyCartContainer>
          <EmptyCart>
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
          </EmptyCart>
        </EmptyCartContainer>
      </PageWrapper>
    )
  }

  const { subtotal, freeShipping, estimatedTaxes, total } = calculateTotal()

  return (
    <PageWrapper>
      <CartWrapper>
        <TitleWrapper>
          <Header>Your Cart</Header>
        </TitleWrapper>
        <CartContainer>
          {cart.map((item) => (
            <React.Fragment key={item.product_id}>
              <RemoveButtonWrapper>
                <RemoveButton onClick={() => removeFromCart(item.product_id)}>
                  <VscClose size={28} />
                </RemoveButton>
              </RemoveButtonWrapper>
              <ProductCard key={item.product_id}>
                <ImageWrapper>
                  <Link href={`/products/${item.product_slug}`}>
                    <Image
                      src={item.product_image_url}
                      alt={item.product_name}
                      width="80"
                      height="80"
                    />
                  </Link>
                </ImageWrapper>
                <DetailsWrapper>
                  <PriceWrapper>
                    <p>${item.product_price}</p>
                  </PriceWrapper>
                  <Link href={`/products/${item.product_slug}`}>
                    {item.product_name}
                  </Link>
                  <QuantityWrapper>
                    <QuantityPicker
                      quantity={item.quantity}
                      onQuantityChange={(newQuantity) =>
                        handleQuantityChange(item.product_id, newQuantity)
                      }
                    />
                  </QuantityWrapper>
                </DetailsWrapper>
              </ProductCard>
            </React.Fragment>
          ))}
        </CartContainer>
      </CartWrapper>
      <OrderSummaryContainer>
        <h2>Order Summary</h2>
        <SummaryItem>
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </SummaryItem>
        <SummaryItem>
          <span>Free Shipping</span>
          <span>${freeShipping}</span>
        </SummaryItem>
        <SummaryItem>
          <span>Estimated Taxes</span>
          <span>${estimatedTaxes}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>Total</strong>
          <strong>${total}</strong>
        </SummaryItem>
      </OrderSummaryContainer>
    </PageWrapper>
  )
}

export default Cart
