import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import { CartContext } from "../context/CartContext"
import { useRouter } from "next/router"
import styled from "styled-components"
import LoaderDots from "../components/loaders/LoaderDots"
import { BsCartX } from "react-icons/bs"
import { VscClose } from "react-icons/vsc"
import QuantityPicker from "../components/shopping/QuantityPicker"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"

const PageWrapper = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-flow: wrap;
`

const ProductCard = styled.li`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  height: 100%;
`

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 8px;
  order: 2;
`

const Title = styled(Link)`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  order: 1;
  width: 100%;
`

const Price = styled.h1`
  font-size: 28px;
  font-weight: 500;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  order: 3;
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
        /* console.log("User attributes are null, skipping fetch") // This was useful for early debugging */
      }
      await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms delay

      try {
        if (userAttributes) {
          const response = await fetch(
            `/api/cart?cognitoSub=${userAttributes.sub}`,
            {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
            }
          )
          const data = await response.json()
          setCart(
            data.map((item) => ({ ...item, quantity: item.quantity || 1 }))
          )
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart")) || []
          if (localCart.length > 0) {
            const productIds = localCart
              .map((item) => item.product_id)
              .join(",")
            const response = await fetch(`/api/cart?productIds=${productIds}`, {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
            })
            const data = await response.json()
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
      if (userAttributes) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
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
      toast.success("Removed from cart.", {
        position: "bottom-right",
      })
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

    return {
      subtotal: subtotal.toFixed(2),
      freeShipping: freeShipping.toFixed(2),
      estimatedTaxes: estimatedTaxes.toFixed(2),
      total: total.toFixed(2),
    }
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (userAttributes) {
        await fetch("/api/cart", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
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
                  <Link
                    href={`/products/${item.product_slug}`}
                    aria-label={`View details of ${item.product_name}`}
                  >
                    <Image
                      src={item.product_image_url}
                      alt={item.product_name}
                      width={150}
                      height={150}
                    />
                  </Link>
                </ImageWrapper>
                <Title
                  href={`/products/${item.product_slug}`}
                  aria-label={`View details of ${item.product_name}`}
                >
                  {item.product_name}
                </Title>
                <Details>
                  <Price>${item.product_price}</Price>
                  <QuantityWrapper>
                    <QuantityPicker
                      quantity={item.quantity}
                      onQuantityChange={(newQuantity) =>
                        handleQuantityChange(item.product_id, newQuantity)
                      }
                    />
                  </QuantityWrapper>
                </Details>
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
