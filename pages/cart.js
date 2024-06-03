import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import { FaTimes, FaLongArrowAltRight } from "react-icons/fa"
import { SiteContext } from "../context/mainContext"
import Image from "../components/common/Image"
import Head from "next/head"
import CartLink from "../components/shopping/CartLink"
import Cookies from "js-cookie"
import SavedItems from "../components/shopping/SavedItems"
import LocationEstimator from "../components/shopping/LocationEstimator"
import styled from "styled-components"
import QuantityPicker from "../components/shopping/QuantityPicker"

const CartPageWrapper = styled.div`
  display: grid;
  grid-template-areas:
    "cart-title order-summary"
    "cart-items order-summary"
    "saved-items order-summary";
  padding: 5px 30px 30px 30px;
  grid-column-gap: 30px;

  @media (max-width: 768px) {
    .cart-page-wrapper {
      display: flex;
      flex-direction: column;
    }
  }
`

const CartPageTitle = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: #000;
  padding: 10px 0 0 0;
  grid-area: cart-title;
`

const Cart = ({ context }) => {
  const [renderClientSideComponent, setRenderClientSideComponent] =
    useState(false)

  const salesTaxPercentage = 6 // Fixed sales tax percentage for demonstration purposes

  useEffect(() => {
    setRenderClientSideComponent(true)
  }, [])

  const {
    numberOfItemsInCart,
    cart,
    removeFromCart,
    total,
    setItemQuantity,
    setCart,
  } = context
  const cartEmpty = numberOfItemsInCart === Number(0)

  function increment(item) {
    item.quantity = item.quantity + 1
    setItemQuantity(item)
  }

  function decrement(item) {
    if (item.quantity === 1) return
    item.quantity = item.quantity - 1
    setItemQuantity(item)
  }

  function saveForLater(item, savedItems) {
    if (savedItems.length >= 10) {
      // Test
      console.log("You have reached the maximum limit for saved items.")
      return
    }

    // Store the item in cookies
    Cookies.set("savedForLater", JSON.stringify(item), {
      sameSite: "None",
      secure: true,
    })

    // Remove the item from the cart
    removeFromCart(item)
  }

  function moveBackToCart(savedItem) {
    // Retrieve the current cart items
    const currentCart = [...cart]

    // Add the saved item back to the cart
    currentCart.push(savedItem)

    // Update the cart state
    setCart(currentCart)

    // Remove the saved item from cookies
    Cookies.remove("savedForLater")
  }

  const handleZipCodeChange = (zipCode) => {
    // Handle the zip code change
    setEstimatedZipCode(zipCode)
  }

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0)

  if (!renderClientSideComponent) return null

  // Calculate sales tax amount
  const salesTaxAmount = ((total * salesTaxPercentage) / 100).toFixed(2)

  // Calculate total including sales tax
  const totalWithSalesTax = (
    parseFloat(total) + parseFloat(salesTaxAmount)
  ).toFixed(2)
  return (
    <>
      <Head>
        <title>Cart - TechNexus</title>
        <meta
          name="description"
          content="A cart overview of your TechNexus store items, shipping method, and total cost."
        />
        <meta property="og:title" content="Cart - TechNexus" key="title" />
      </Head>
      <CartPageWrapper>
        <CartPageTitle>Cart</CartPageTitle>
        {cartEmpty ? (
          <h3>No items in cart.</h3>
        ) : (
          <div>
            {cart.map((item) => {
              return (
                <div className="cart-item-container" key={item.id}>
                  <div className="cart-item-wrapper">
                    <Link href={`${item.slug}`}>
                      <Image
                        className="cart-image-container"
                        src={item.image.image_url}
                        alt={item.name}
                      />
                    </Link>
                    <div className="cart-item-name-wrapper">
                      <Link href={`${item.slug}`}>
                        <p className="cart-item-name">{item.name}</p>
                      </Link>
                    </div>
                    <div className="cart-button-wrapper">
                      <QuantityPicker
                        value={item.quantity}
                        onQuantityChange={(newQuantity) =>
                          setItemQuantity({
                            ...item,
                            quantity: newQuantity,
                          })
                        }
                      />
                      <button
                        className="save-later-btn"
                        onClick={() => saveForLater(item)}
                      >
                        Save for later
                      </button>
                    </div>
                    <div className="cart-item-pricing-container">
                      <p className="cart-item-price">
                        {item.quantity > 1
                          ? `Total: $${(item.quantity * item.price).toFixed(2)}`
                          : `$${item.price}`}
                      </p>
                      {item.quantity > 1 && (
                        <p className="cart-item-price-each">
                          {"each " + "$" + item.price}
                        </p>
                      )}
                    </div>
                    <div className="cart-remove-container">
                      <div
                        role="button"
                        onClick={() => removeFromCart(item)}
                        className="cart-remove-btn"
                      >
                        <FaTimes />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {!cartEmpty && (
          <div className="cart-page-total-container">
            <p className="cart-page-order-header">Order summary</p>
            <div className="cart-page-subtotal-container">
              <div className="cart-page-order-subtotal">
                {`Subtotal (${totalQuantity} item${
                  totalQuantity !== 1 ? "s" : ""
                })`}
              </div>
              <div className="cart-price-text-header">{`$${total}`}</div>
            </div>
            <div className="cart-page-subtotal-container">
              <div className="cart-page-order-subtotal">Shipping</div>
              <div className="cart-page-order-subtotal">Free</div>
            </div>
            <div className="cart-page-subtotal-container">
              <div className="cart-page-order-subtotal">
                Estimated taxes{" "}
                <LocationEstimator onZipCodeChange={handleZipCodeChange} />
              </div>
              <div className="cart-page-order-subtotal">
                {`$${salesTaxAmount}`}
              </div>
            </div>
            <div className="cart-page-subtotal-container">
              <div className="cart-price-text-header">Total</div>
              <div className="cart-price-text-header">
                {`$${totalWithSalesTax}`}
              </div>
            </div>
            <Link href="/checkout">
              <div className="cart-checkout-btn">Checkout</div>
            </Link>
          </div>
        )}
        <div className="saved-items-container">
          <SavedItems moveBackToCart={moveBackToCart} />
        </div>
      </CartPageWrapper>
    </>
  )
}

function CartWithContext(props) {
  const context = useContext(SiteContext)

  return <Cart {...props} context={context} />
}

export default CartWithContext
