import Cookies from "js-cookie"
import Link from "next/link"
import { slugify } from "../../utils/helpers"
import { BsFillClockFill } from "react-icons/bs"

function SavedItems({ moveBackToCart }) {
  const savedItems = Cookies.get("savedForLater")

  if (!savedItems) {
    return (
      <div className="saved-items-none-wrapper">
        <div className="saved-items-clk">
          <BsFillClockFill />
        </div>
        <div className="cart-page-text-header">Save your items for later</div>
        <div className="saved-items-none-text">
          Not ready to buy? Select Save for later and return to them here.
        </div>
      </div>
    )
  }

  const savedItem = JSON.parse(savedItems)

  // Display the saved item and provide an option to move it back to the cart
  return (
    <div>
      <p className="cart-page-text-header">Saved for Later</p>
      <div className="saved-items-wrapper">
        <Link href={`/product/${slugify(savedItem.name)}`}>
          <img
            className="cart-image-container"
            src={savedItem.image}
            alt={savedItem.name}
          />
        </Link>
        <p className="cart-item-name">{savedItem.name}</p>
        <div className="cart-item-pricing-container">
          <p className="cart-item-price">{$ + savedItem.price}</p>
        </div>
        <div className="cart-button-wrapper">
          <button
            className="add-cart-btn-cat"
            onClick={() => moveBackToCart(savedItem)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default SavedItems
